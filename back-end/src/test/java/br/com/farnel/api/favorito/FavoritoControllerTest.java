package br.com.farnel.api.favorito;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.nullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;

import br.com.farnel.api.TesteDeIntegracao;

class FavoritoControllerTest extends TesteDeIntegracao {

	@Test
	void favoritosExigemLogin() throws Exception {
		mvc.perform(get("/me/favoritos")).andExpect(status().isUnauthorized());
		mvc.perform(put("/me/favoritos/{id}", idDoExemplo("Arroz Integral em Pacotes")))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void favoritaListaERemove() throws Exception {
		ContaDeTeste conta = cadastrar();
		Long arroz = idDoExemplo("Arroz Integral em Pacotes");

		mvc.perform(put("/me/favoritos/{id}", arroz).cookie(conta.acesso())).andExpect(status().isNoContent());
		// Favoritar de novo não dá erro nem duplica
		mvc.perform(put("/me/favoritos/{id}", arroz).cookie(conta.acesso())).andExpect(status().isNoContent());

		mvc.perform(get("/me/favoritos").cookie(conta.acesso()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(1)))
				.andExpect(jsonPath("$[0].id").value(arroz.intValue()))
				.andExpect(jsonPath("$[0].titulo").value("Arroz Integral em Pacotes"))
				// O telefone do doador segue a regra da lista: só aparece depois de um pedido aceito
				.andExpect(jsonPath("$[0].contato").value(nullValue()));

		mvc.perform(delete("/me/favoritos/{id}", arroz).cookie(conta.acesso())).andExpect(status().isNoContent());
		mvc.perform(get("/me/favoritos").cookie(conta.acesso()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(0)));
	}

	@Test
	void cadaContaTemASuaLista() throws Exception {
		ContaDeTeste ana = cadastrar();
		ContaDeTeste bruno = cadastrar();

		mvc.perform(put("/me/favoritos/{id}", idDoExemplo("Cestas de Banana Prata")).cookie(ana.acesso()))
				.andExpect(status().isNoContent());

		mvc.perform(get("/me/favoritos").cookie(bruno.acesso()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(0)));
	}

	@Test
	void naoFavoritaDoacaoEncerradaOuQueNaoExiste() throws Exception {
		ContaDeTeste conta = cadastrar();

		// Exemplo já entregue (Concluída)
		mvc.perform(put("/me/favoritos/{id}", idDoExemplo("Lentilha e Grão-de-Bico")).cookie(conta.acesso()))
				.andExpect(status().isConflict());
		// Exemplo Disponível, mas com a validade vencida
		mvc.perform(put("/me/favoritos/{id}", idDoExemplo("Mangas Palmer")).cookie(conta.acesso()))
				.andExpect(status().isConflict())
				.andExpect(jsonPath("$.message").value("Doações vencidas, entregues ou canceladas não podem ser favoritadas."));

		mvc.perform(put("/me/favoritos/{id}", 999_999).cookie(conta.acesso()))
				.andExpect(status().isNotFound());
	}
}
