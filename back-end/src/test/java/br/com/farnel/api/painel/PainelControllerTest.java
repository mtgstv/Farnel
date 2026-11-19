package br.com.farnel.api.painel;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import br.com.farnel.api.TesteDeIntegracao;

import jakarta.servlet.http.Cookie;

class PainelControllerTest extends TesteDeIntegracao {

	@Test
	void painelExigeLogin() throws Exception {
		mvc.perform(get("/me/painel")).andExpect(status().isUnauthorized());
	}

	@Test
	void contaNovaComecaZerada() throws Exception {
		mvc.perform(get("/me/painel").cookie(cadastrar().acesso()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.totalDoacoes").value(0))
				// As situações aparecem mesmo com zero, na ordem dos gráficos
				.andExpect(jsonPath("$.doacoesPorStatus", hasSize(5)))
				.andExpect(jsonPath("$.doacoesPorStatus[2].rotulo").value("Vencida"))
				.andExpect(jsonPath("$.doacoesPorStatus[2].total").value(0))
				.andExpect(jsonPath("$.doacoesPorCategoria", hasSize(0)))
				.andExpect(jsonPath("$.pedidosFeitos", hasSize(5)))
				.andExpect(jsonPath("$.favoritos").value(0));
	}

	@Test
	void numerosAcompanhamAsDoacoesEOsPedidos() throws Exception {
		ContaDeTeste doador = cadastrar();
		ContaDeTeste quemPede = cadastrar();
		Long entregue = cadastrarDoacao(doador);
		cadastrarDoacao(doador);

		// Um pedido feito, aceito e entregue
		Long pedidoId = lerId(mvc.perform(post("/solicitacoes")
				.cookie(quemPede.acesso())
				.contentType(MediaType.APPLICATION_JSON)
				.content("""
						{"doacaoId": %d, "tipoSolicitante": "Pessoa física", "nome": "Quem Pede", "contato": "(81) 98888-0000",
						 "quantidade": "tudo", "dataRetirada": "%s", "forma": "A combinar"}
						""".formatted(entregue, LocalDate.now().plusDays(1))))
				.andExpect(status().isCreated())
				.andReturn().getResponse());
		mudarStatus(pedidoId, "Aceita", doador.acesso());
		mudarStatus(pedidoId, "Concluída", doador.acesso());
		mvc.perform(put("/me/favoritos/{id}", idDoExemplo("Arroz Integral em Pacotes")).cookie(doador.acesso()));

		mvc.perform(get("/me/painel").cookie(doador.acesso()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.totalDoacoes").value(2))
				.andExpect(jsonPath("$.doacoesPorStatus[0].total").value(1)) // Disponível
				.andExpect(jsonPath("$.doacoesPorStatus[3].rotulo").value("Concluída"))
				.andExpect(jsonPath("$.doacoesPorStatus[3].total").value(1))
				.andExpect(jsonPath("$.doacoesPorCategoria[0].rotulo").value("Padaria"))
				.andExpect(jsonPath("$.doacoesPorCategoria[0].total").value(2))
				// A doação entregue tinha 20 pacotes
				.andExpect(jsonPath("$.entregue[0].unidade").value("pacotes"))
				.andExpect(jsonPath("$.entregue[0].total").value(20))
				.andExpect(jsonPath("$.pessoasAtendidas").value(1))
				.andExpect(jsonPath("$.pedidosRecebidos[2].rotulo").value("Concluída"))
				.andExpect(jsonPath("$.pedidosRecebidos[2].total").value(1))
				.andExpect(jsonPath("$.favoritos").value(1));

		mvc.perform(get("/me/painel").cookie(quemPede.acesso()))
				.andExpect(jsonPath("$.pedidosFeitos[2].total").value(1));
	}

	@Test
	void contaDosExemplosTemAsTrintaDoacoes() throws Exception {
		mvc.perform(get("/me/painel").cookie(entrar("exemplos@farnel.dev", SENHA_DOS_EXEMPLOS)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.totalDoacoes").value(30))
				.andExpect(jsonPath("$.doacoesPorCategoria", hasSize(10)))
				.andExpect(jsonPath("$.doacoesPorStatus[2].total").value(5)); // 5 exemplos vencidos
	}

	private void mudarStatus(Long pedidoId, String status, Cookie acesso) throws Exception {
		mvc.perform(patch("/solicitacoes/{id}/status", pedidoId)
				.cookie(acesso)
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"status\": \"%s\"}".formatted(status)))
				.andExpect(status().isOk());
	}
}
