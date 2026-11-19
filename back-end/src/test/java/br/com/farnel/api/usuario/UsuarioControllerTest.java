package br.com.farnel.api.usuario;

import static org.hamcrest.Matchers.nullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.RequestBuilder;

import br.com.farnel.api.TesteDeIntegracao;

import jakarta.servlet.http.Cookie;

class UsuarioControllerTest extends TesteDeIntegracao {

	// Um perfil completo de instituição, no formato que a página "Meu perfil" envia
	private static String perfil(String email) {
		return """
				{"nome": "Maria Souza", "email": "%s", "telefone": "(81) 98888-1234", "perfil": "ONG ou instituição",
				 "organizacao": "ONG Mesa Cheia", "sobre": "Atendemos 50 famílias.", "cidade": "Recife", "uf": "PE",
				 "endereco": "Rua da Aurora, 10", "horario": "Seg. a sex.", "foto": null,
				 "interesses": ["Frutas", "Grãos"],
				 "avisos": {"novasDoacoes": true, "pedidosRecebidos": false, "lembretesValidade": true}}
				""".formatted(email);
	}

	private static RequestBuilder salvarPerfil(String corpo, Cookie acesso) {
		return put("/me").cookie(acesso).contentType(MediaType.APPLICATION_JSON).content(corpo);
	}

	private static RequestBuilder trocarSenha(String atual, String nova, Cookie acesso) {
		return patch("/me/senha")
				.cookie(acesso)
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"senhaAtual\": \"%s\", \"novaSenha\": \"%s\"}".formatted(atual, nova));
	}

	@Test
	void perfilExigeLogin() throws Exception {
		mvc.perform(put("/me").contentType(MediaType.APPLICATION_JSON).content(perfil("x@farnel.com")))
				.andExpect(status().isUnauthorized());
		mvc.perform(patch("/me/senha").contentType(MediaType.APPLICATION_JSON).content("{}"))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void salvaOPerfilEOMeDevolveOsDadosNovos() throws Exception {
		ContaDeTeste conta = cadastrar();

		mvc.perform(salvarPerfil(perfil(conta.email()), conta.acesso()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.perfil").value("ONG ou instituição"))
				.andExpect(jsonPath("$.organizacao").value("ONG Mesa Cheia"));

		mvc.perform(get("/me").cookie(conta.acesso()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.nome").value("Maria Souza"))
				.andExpect(jsonPath("$.telefone").value("(81) 98888-1234"))
				.andExpect(jsonPath("$.cidade").value("Recife"))
				// Sempre na ordem da lista de categorias, não na ordem em que foram marcadas
				.andExpect(jsonPath("$.interesses[0]").value("Grãos"))
				.andExpect(jsonPath("$.interesses[1]").value("Frutas"))
				.andExpect(jsonPath("$.avisos.pedidosRecebidos").value(false))
				.andExpect(jsonPath("$.foto").value(nullValue()))
				.andExpect(jsonPath("$.senhaHash").doesNotExist());
	}

	@Test
	void perfilInvalidoDevolveOErroDeCadaCampo() throws Exception {
		ContaDeTeste conta = cadastrar();

		mvc.perform(salvarPerfil("""
				{"nome": "", "email": "nao-e-email", "telefone": "123", "perfil": "Pessoa física", "uf": "XX"}
				""", conta.acesso()))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.campos.nome").value("Informe seu nome."))
				.andExpect(jsonPath("$.campos.email").value("Digite um e-mail válido."))
				.andExpect(jsonPath("$.campos.telefone").value("Informe o telefone com DDD."))
				.andExpect(jsonPath("$.campos.uf").value("Escolha o estado."));

		// Instituição precisa do nome da instituição
		mvc.perform(salvarPerfil(perfil(conta.email()).replace("\"ONG Mesa Cheia\"", "\"\""), conta.acesso()))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.campos.organizacao").value("Informe o nome do estabelecimento ou da instituição."));
	}

	@Test
	void naoDeixaUsarOEmailDeOutraConta() throws Exception {
		ContaDeTeste ana = cadastrar();
		ContaDeTeste bruno = cadastrar();

		mvc.perform(salvarPerfil(perfil(ana.email().toUpperCase()), bruno.acesso()))
				.andExpect(status().isConflict())
				.andExpect(jsonPath("$.message").value("Este e-mail já está em uso por outra conta."));
	}

	@Test
	void trocaASenhaConferindoAAtual() throws Exception {
		ContaDeTeste conta = cadastrar();

		mvc.perform(trocarSenha("senha-errada", "senha-nova-123", conta.acesso()))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.campos.senhaAtual").value("Senha atual incorreta."));
		mvc.perform(trocarSenha(SENHA, SENHA, conta.acesso()))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.campos.novaSenha").value("A nova senha deve ser diferente da atual."));

		mvc.perform(trocarSenha(SENHA, "senha-nova-123", conta.acesso())).andExpect(status().isNoContent());

		// A senha nova vale para entrar; a antiga, não
		entrar(conta.email(), "senha-nova-123");
		mvc.perform(post("/auth/login")
				.with(requisicao -> {
					requisicao.setRemoteAddr(novoIp());
					return requisicao;
				})
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"email\": \"%s\", \"senha\": \"%s\"}".formatted(conta.email(), SENHA)))
				.andExpect(status().isUnauthorized());
	}
}
