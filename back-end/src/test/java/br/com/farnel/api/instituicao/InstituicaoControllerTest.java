package br.com.farnel.api.instituicao;

import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.not;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.RequestBuilder;

import br.com.farnel.api.TesteDeIntegracao;

import jakarta.servlet.http.Cookie;

class InstituicaoControllerTest extends TesteDeIntegracao {

	private static RequestBuilder verificar(Long id, boolean verificada, Cookie acesso) {
		return patch("/admin/instituicoes/{id}/verificacao", id)
				.cookie(acesso)
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"verificada\": %s}".formatted(verificada));
	}

	private static RequestBuilder salvarPerfil(String email, String perfil, String organizacao, Cookie acesso) {
		return put("/me")
				.cookie(acesso)
				.contentType(MediaType.APPLICATION_JSON)
				.content("""
						{"nome": "Responsável", "email": "%s", "perfil": "%s", "organizacao": "%s", "cidade": "Olinda", "uf": "PE"}
						""".formatted(email, perfil, organizacao));
	}

	@Test
	void listaPublicaTrazAsVerificadasComAsDoacoesRecebidas() throws Exception {
		// Sem login; a Rede Solidária (dados de exemplo) é verificada e recebeu as 5 doações "Concluída"
		mvc.perform(get("/instituicoes"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$[?(@.nome == 'Rede Solidária Farnel')].doacoesRecebidas").value(hasItem(5)))
				// A Cozinha Comunitária Esperança ainda não foi verificada
				.andExpect(jsonPath("$[*].nome").value(not(hasItem("Cozinha Comunitária Esperança"))));
	}

	@Test
	void administradorVerificaUmaInstituicao() throws Exception {
		Cookie admin = entrar("admin@farnel.dev", SENHA_DOS_EXEMPLOS);
		ContaDeTeste conta = cadastrar();
		mvc.perform(salvarPerfil(conta.email(), "ONG ou instituição", "ONG Olinda Solidária", conta.acesso()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.verificada").value(false));

		// Aparece para o administrador, mas ainda não na lista pública
		mvc.perform(get("/admin/instituicoes").cookie(admin))
				.andExpect(jsonPath("$[*].nome").value(hasItem("ONG Olinda Solidária")));
		mvc.perform(get("/instituicoes"))
				.andExpect(jsonPath("$[*].nome").value(not(hasItem("ONG Olinda Solidária"))));

		mvc.perform(verificar(conta.id(), true, admin)).andExpect(status().isNoContent());
		mvc.perform(get("/instituicoes"))
				.andExpect(jsonPath("$[*].nome").value(hasItem("ONG Olinda Solidária")));
		mvc.perform(get("/me").cookie(conta.acesso())).andExpect(jsonPath("$.verificada").value(true));

		// Se deixar de ser instituição, perde a verificação e sai da lista
		mvc.perform(salvarPerfil(conta.email(), "Pessoa física", "", conta.acesso()))
				.andExpect(jsonPath("$.verificada").value(false));
		mvc.perform(get("/instituicoes"))
				.andExpect(jsonPath("$[*].nome").value(not(hasItem("ONG Olinda Solidária"))));
	}

	@Test
	void soInstituicaoPodeSerVerificadaESoPeloAdministrador() throws Exception {
		ContaDeTeste pessoa = cadastrar();

		// Conta comum não acessa a área administrativa
		mvc.perform(get("/admin/instituicoes").cookie(pessoa.acesso())).andExpect(status().isForbidden());
		mvc.perform(verificar(pessoa.id(), true, pessoa.acesso())).andExpect(status().isForbidden());

		// Pessoa física não é instituição
		mvc.perform(verificar(pessoa.id(), true, entrar("admin@farnel.dev", SENHA_DOS_EXEMPLOS)))
				.andExpect(status().isConflict());
	}
}
