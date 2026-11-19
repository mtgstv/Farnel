package br.com.farnel.api.admin;

import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.RequestBuilder;

import br.com.farnel.api.TesteDeIntegracao;

import jakarta.servlet.http.Cookie;

class AdminControllerTest extends TesteDeIntegracao {

	private Cookie administrador() throws Exception {
		return entrar("admin@farnel.dev", SENHA_DOS_EXEMPLOS);
	}

	private static RequestBuilder mudarPapel(Long usuarioId, String papel, Cookie acesso) {
		return patch("/admin/usuarios/{id}/papel", usuarioId)
				.cookie(acesso)
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"papel\": \"%s\"}".formatted(papel));
	}

	private static RequestBuilder cancelar(Long doacaoId, Cookie acesso) {
		return patch("/admin/doacoes/{id}/status", doacaoId)
				.cookie(acesso)
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"status\": \"Cancelada\"}");
	}

	@Test
	void areaAdministrativaExigeLoginEPapelAdmin() throws Exception {
		mvc.perform(get("/admin/painel")).andExpect(status().isUnauthorized());

		// Conta comum: está logada, mas não tem permissão
		Cookie comum = cadastrar().acesso();
		mvc.perform(get("/admin/painel").cookie(comum)).andExpect(status().isForbidden());
		mvc.perform(get("/admin/doacoes").cookie(comum)).andExpect(status().isForbidden());
		mvc.perform(get("/admin/usuarios").cookie(comum)).andExpect(status().isForbidden());
		mvc.perform(mudarPapel(1L, "ADMIN", comum)).andExpect(status().isForbidden());
	}

	@Test
	void painelMostraOsNumerosDoSiteInteiro() throws Exception {
		mvc.perform(get("/admin/painel").cookie(administrador()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.totalDoacoes").value(greaterThanOrEqualTo(30)))
				.andExpect(jsonPath("$.administradores").value(greaterThanOrEqualTo(1)))
				.andExpect(jsonPath("$.doacoesPorStatus", hasSize(5)))
				.andExpect(jsonPath("$.pedidosPorStatus", hasSize(5)))
				.andExpect(jsonPath("$.totalPedidos").value(greaterThanOrEqualTo(6)));
	}

	@Test
	void administradorCancelaDoacaoDeOutraPessoa() throws Exception {
		Cookie admin = administrador();
		ContaDeTeste doador = cadastrar();
		ContaDeTeste quemPede = cadastrar();
		Long doacaoId = cadastrarDoacao(doador);
		mvc.perform(post("/solicitacoes")
				.cookie(quemPede.acesso())
				.contentType(MediaType.APPLICATION_JSON)
				.content("""
						{"doacaoId": %d, "tipoSolicitante": "Pessoa física", "nome": "Quem Pede", "contato": "(81) 98888-0000",
						 "quantidade": "tudo", "dataRetirada": "%s", "forma": "A combinar"}
						""".formatted(doacaoId, LocalDate.now().plusDays(1))))
				.andExpect(status().isCreated());

		// A lista do administrador mostra quem cadastrou cada doação
		mvc.perform(get("/admin/doacoes").cookie(admin))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$[?(@.doacao.id == %d)].dono.email".formatted(doacaoId)).value(hasItem(doador.email())));

		mvc.perform(cancelar(doacaoId, admin))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.doacao.status").value("Cancelada"));

		// O pedido que estava em aberto foi cancelado junto
		mvc.perform(get("/me/solicitacoes/feitas").cookie(quemPede.acesso()))
				.andExpect(jsonPath("$[0].status").value("Cancelada"));

		mvc.perform(cancelar(doacaoId, admin)).andExpect(status().isConflict());
	}

	@Test
	void administradorTornaOutraContaAdministradora() throws Exception {
		Cookie admin = administrador();
		ContaDeTeste conta = cadastrar();

		mvc.perform(mudarPapel(conta.id(), "ADMIN", admin))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.papel").value("ADMIN"));

		// Com um token novo (ao entrar de novo), a conta passa a abrir a área administrativa
		mvc.perform(get("/admin/painel").cookie(entrar(conta.email(), SENHA))).andExpect(status().isOk());

		mvc.perform(get("/admin/usuarios").cookie(admin))
				.andExpect(jsonPath("$[?(@.id == %d)].papel".formatted(conta.id())).value(hasItem("ADMIN")));
	}

	@Test
	void administradorNaoMudaOProprioPapel() throws Exception {
		Cookie admin = administrador();
		Long meuId = lerId(mvc.perform(get("/me").cookie(admin)).andReturn().getResponse());

		mvc.perform(mudarPapel(meuId, "USUARIO", admin))
				.andExpect(status().isConflict())
				.andExpect(jsonPath("$.message").value("Você não pode mudar o seu próprio papel."));
	}
}
