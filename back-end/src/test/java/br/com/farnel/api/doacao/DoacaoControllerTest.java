package br.com.farnel.api.doacao;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.nullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.RequestBuilder;

import br.com.farnel.api.TesteDeIntegracao;

import jakarta.servlet.http.Cookie;

class DoacaoControllerTest extends TesteDeIntegracao {

	@Test
	void listaEhPublicaETrazAsDoacoesDeExemplo() throws Exception {
		mvc.perform(get("/doacoes"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(30))))
				.andExpect(jsonPath("$[0].titulo").value("Arroz Integral em Pacotes"))
				// A API fala a língua da tela: "Grãos", e não o código GRAOS guardado no banco
				.andExpect(jsonPath("$[0].categoria").value("Grãos"))
				.andExpect(jsonPath("$[0].status").value("Disponível"))
				.andExpect(jsonPath("$[0].imagem").value("/images/doacoes/arroz-integral.jpg"))
				// Visitante não vê o telefone do doador
				.andExpect(jsonPath("$[0].contato").value(nullValue()));
	}

	// Depois que o doador aceita um pedido, quem pediu também vê (ver SolicitacaoControllerTest)
	@Test
	void telefoneDoDoadorSoApareceParaOProprioDoador() throws Exception {
		ContaDeTeste doador = cadastrar();
		Long id = cadastrarDoacao(doador);

		// Visitante
		mvc.perform(get("/doacoes/{id}", id))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.contato").value(nullValue()));

		// Outra conta, sem pedido aceito nesta doação
		mvc.perform(get("/doacoes/{id}", id).cookie(cadastrar().acesso()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.contato").value(nullValue()));

		mvc.perform(get("/doacoes/{id}", id).cookie(doador.acesso()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.contato").value("(81) 99999-0000"));
	}

	@Test
	void doacaoQueNaoExisteDa404() throws Exception {
		mvc.perform(get("/doacoes/{id}", 999_999))
				.andExpect(status().isNotFound())
				.andExpect(jsonPath("$.message").value("Doação não encontrada."));

		mvc.perform(get("/doacoes/abc")).andExpect(status().isBadRequest());
	}

	@Test
	void cadastrarEAlterarExigemLogin() throws Exception {
		mvc.perform(post("/doacoes").contentType(MediaType.APPLICATION_JSON).content(DOACAO_VALIDA))
				.andExpect(status().isUnauthorized());
		mvc.perform(get("/me/doacoes")).andExpect(status().isUnauthorized());
		mvc.perform(patch("/doacoes/{id}/status", idDoExemplo("Arroz Integral em Pacotes"))
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"status\": \"Cancelada\"}"))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void cadastroInvalidoDevolveOErroDeCadaCampo() throws Exception {
		mvc.perform(post("/doacoes")
				.cookie(cadastrar().acesso())
				.contentType(MediaType.APPLICATION_JSON)
				.content("""
						{"titulo": "ab", "quantidade": 0, "validade": "2020-01-01", "uf": "XX",
						 "contato": "123", "imagem": "nao-e-uma-foto"}
						"""))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.campos.titulo").value("Dê um nome ao alimento (entre 3 e 100 letras)."))
				.andExpect(jsonPath("$.campos.categoria").value("Escolha uma categoria."))
				.andExpect(jsonPath("$.campos.quantidade").value("Informe uma quantidade maior que zero."))
				.andExpect(jsonPath("$.campos.validade").value("Não é possível doar alimentos vencidos."))
				.andExpect(jsonPath("$.campos.uf").value("Escolha o estado."))
				.andExpect(jsonPath("$.campos.contato").value("Informe um telefone com DDD."))
				.andExpect(jsonPath("$.campos.imagem").value("Envie a foto em JPG, PNG ou WEBP."));
	}

	@Test
	void retiradaNoLocalExigeEndereco() throws Exception {
		mvc.perform(post("/doacoes")
				.cookie(cadastrar().acesso())
				.contentType(MediaType.APPLICATION_JSON)
				.content(DOACAO_VALIDA.replace("\"Rua da Aurora, 100 - Boa Vista\"", "\"\"")))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.campos.endereco").value("Informe o endereço de retirada."));
	}

	@Test
	void doacaoCadastradaApareceNasMinhasDoacoesENaLista() throws Exception {
		ContaDeTeste conta = cadastrar();

		var resposta = mvc.perform(post("/doacoes")
				.cookie(conta.acesso())
				.contentType(MediaType.APPLICATION_JSON)
				.content(DOACAO_VALIDA))
				.andExpect(status().isCreated())
				.andExpect(header().string("Location", containsString("/doacoes/")))
				.andExpect(jsonPath("$.status").value("Disponível"))
				.andExpect(jsonPath("$.usuarioId").value(conta.id().intValue()))
				// Sempre na ordem da lista, não na ordem em que foram marcados
				.andExpect(jsonPath("$.alergenicos[0]").value("Glúten"))
				.andExpect(jsonPath("$.alergenicos[1]").value("Lactose"))
				// Campo opcional em branco vira nulo
				.andExpect(jsonPath("$.observacoes").value(nullValue()))
				.andReturn().getResponse();
		Long id = lerId(resposta);

		mvc.perform(get("/me/doacoes").cookie(conta.acesso()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(1)))
				.andExpect(jsonPath("$[0].id").value(id.intValue()))
				.andExpect(jsonPath("$[0].contato").value("(81) 99999-0000"));

		mvc.perform(get("/doacoes/{id}", id))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.titulo").value("Pães de forma"))
				.andExpect(jsonPath("$.imagem").value("data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ=="));
	}

	@Test
	void soQuemCadastrouPodeEncerrarADoacao() throws Exception {
		ContaDeTeste dono = cadastrar();
		Long id = cadastrarDoacao(dono);

		mvc.perform(alterarStatus(id, "Cancelada", cadastrar().acesso()))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.message").value("Só quem cadastrou a doação pode alterar o status dela."));

		mvc.perform(alterarStatus(id, "Disponível", dono.acesso()))
				.andExpect(status().isBadRequest());

		mvc.perform(alterarStatus(id, "Concluída", dono.acesso()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.status").value("Concluída"));

		// Depois de encerrada, não muda mais
		mvc.perform(alterarStatus(id, "Cancelada", dono.acesso()))
				.andExpect(status().isConflict())
				.andExpect(jsonPath("$.message").value("Esta doação já foi encerrada."));
	}

	@Test
	void doacaoVencidaNaoPodeSerMarcadaComoEntregue() throws Exception {
		// "Mangas Palmer" é um exemplo Disponível que venceu há 3 dias; só a conta dos exemplos pode alterá-lo
		Cookie contaDosExemplos = entrar("exemplos@farnel.dev", SENHA_DOS_EXEMPLOS);

		mvc.perform(alterarStatus(idDoExemplo("Mangas Palmer"), "Concluída", contaDosExemplos))
				.andExpect(status().isConflict())
				.andExpect(jsonPath("$.message").value(containsString("vencida")));
	}

	private static RequestBuilder alterarStatus(Long id, String novoStatus, Cookie acesso) {
		return patch("/doacoes/{id}/status", id)
				.cookie(acesso)
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"status\": \"%s\"}".formatted(novoStatus));
	}
}
