package br.com.farnel.api;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import com.jayway.jsonpath.JsonPath;

import br.com.farnel.api.auth.CookiesDeSessao;

import jakarta.servlet.http.Cookie;

// Base dos testes: sobe a API inteira com um Postgres descartável (Testcontainers).
// Todas as classes usam a mesma configuração, então o Spring reaproveita o contexto e o banco.
// Perfil dev: usa as configurações locais e os dados de exemplo (o banco vem do Testcontainers, não do Docker Compose).
@SpringBootTest
@ActiveProfiles("dev")
@AutoConfigureMockMvc
@Import(TestcontainersConfig.class)
public abstract class TesteDeIntegracao {

	protected static final String SENHA = "senha-segura-123";

	// Senha das contas de demonstração dos dados de exemplo (db/exemplo/R__dados_de_exemplo.sql)
	protected static final String SENHA_DOS_EXEMPLOS = "exemplos-farnel";

	// Uma doação válida, no mesmo formato que o formulário do front envia (vence daqui a 5 dias)
	protected static final String DOACAO_VALIDA = """
			{
			  "titulo": "Pães de forma",
			  "categoria": "Padaria",
			  "descricao": "Pães de forma fatiados, embalados e dentro da validade.",
			  "quantidade": 20,
			  "unidade": "pacotes",
			  "validade": "%s",
			  "conservacao": "Temperatura ambiente",
			  "alergenicos": ["Lactose", "Glúten"],
			  "tipoRetirada": "Retirada no local",
			  "cidade": "Recife",
			  "uf": "PE",
			  "endereco": "Rua da Aurora, 100 - Boa Vista",
			  "horario": "Seg. a sex., das 8h às 17h",
			  "observacoes": "",
			  "doador": "Padaria Pão Quente",
			  "contato": "(81) 99999-0000",
			  "imagem": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ=="
			}
			""".formatted(LocalDate.now().plusDays(5));

	private static final AtomicInteger CONTADOR_IP = new AtomicInteger();

	@Autowired
	protected MockMvc mvc;

	protected record ContaDeTeste(Long id, String email, Cookie[] cookies) {

		// Cookie com o token de acesso, para mandar nas rotas que exigem login
		public Cookie acesso() {
			return Arrays.stream(cookies)
					.filter(cookie -> cookie.getName().equals(CookiesDeSessao.ACESSO))
					.findFirst()
					.orElseThrow();
		}
	}

	// Cria uma conta nova (e-mail único) e devolve o id dela e os cookies de login.
	// Cada cadastro vem de um IP diferente para não esbarrar no limite de tentativas.
	protected ContaDeTeste cadastrar() throws Exception {
		String email = "usuario-" + UUID.randomUUID() + "@farnel.com";
		String ip = novoIp();
		MockHttpServletResponse resposta = mvc.perform(post("/auth/cadastro")
				.with(requisicao -> {
					requisicao.setRemoteAddr(ip);
					return requisicao;
				})
				.contentType(MediaType.APPLICATION_JSON)
				.content("""
						{"nome": "Usuário de Teste", "email": "%s", "senha": "%s"}
						""".formatted(email, SENHA)))
				.andExpect(status().isCreated())
				.andReturn().getResponse();

		return new ContaDeTeste(lerId(resposta), email, resposta.getCookies());
	}

	// Entra com uma conta que já existe e devolve o cookie com o token de acesso
	protected Cookie entrar(String email, String senha) throws Exception {
		String ip = novoIp();
		return mvc.perform(post("/auth/login")
				.with(requisicao -> {
					requisicao.setRemoteAddr(ip);
					return requisicao;
				})
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"email\": \"%s\", \"senha\": \"%s\"}".formatted(email, senha)))
				.andExpect(status().isOk())
				.andReturn().getResponse().getCookie(CookiesDeSessao.ACESSO);
	}

	// Cadastra a DOACAO_VALIDA na conta e devolve o id dela
	protected Long cadastrarDoacao(ContaDeTeste conta) throws Exception {
		return lerId(mvc.perform(post("/doacoes")
				.cookie(conta.acesso())
				.contentType(MediaType.APPLICATION_JSON)
				.content(DOACAO_VALIDA))
				.andExpect(status().isCreated())
				.andReturn().getResponse());
	}

	// Id de uma das doações de exemplo (db/exemplo/R__dados_de_exemplo.sql), pelo título
	protected Long idDoExemplo(String titulo) throws Exception {
		String lista = mvc.perform(get("/doacoes")).andReturn().getResponse().getContentAsString(StandardCharsets.UTF_8);
		List<Number> ids = JsonPath.read(lista, "$[?(@.titulo == '" + titulo + "')].id");
		return ids.getFirst().longValue();
	}

	// O campo "id" do JSON de uma resposta
	protected static Long lerId(MockHttpServletResponse resposta) throws Exception {
		Number id = JsonPath.read(resposta.getContentAsString(StandardCharsets.UTF_8), "$.id");
		return id.longValue();
	}

	protected static String novoIp() {
		int numero = CONTADOR_IP.incrementAndGet();
		return "10.0." + numero / 250 + "." + (numero % 250 + 1);
	}
}
