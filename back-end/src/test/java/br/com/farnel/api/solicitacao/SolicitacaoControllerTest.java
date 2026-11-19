package br.com.farnel.api.solicitacao;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.nullValue;
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

class SolicitacaoControllerTest extends TesteDeIntegracao {

	private static final LocalDate AMANHA = LocalDate.now().plusDays(1);

	// Um pedido válido, no mesmo formato que o formulário do front envia
	private static String pedido(Long doacaoId, LocalDate retirada) {
		return """
				{"doacaoId": %d, "tipoSolicitante": "ONG ou instituição", "nome": "ONG Teste",
				 "contato": "(81) 98888-0000", "quantidade": "tudo", "dataRetirada": "%s",
				 "horario": "Manhã", "forma": "Vou retirar no local", "mensagem": "Podemos buscar amanhã."}
				""".formatted(doacaoId, retirada);
	}

	private static RequestBuilder pedir(Long doacaoId, LocalDate retirada, Cookie acesso) {
		return post("/solicitacoes")
				.cookie(acesso)
				.contentType(MediaType.APPLICATION_JSON)
				.content(pedido(doacaoId, retirada));
	}

	private static RequestBuilder alterarStatus(Long solicitacaoId, String novoStatus, Cookie acesso) {
		return patch("/solicitacoes/{id}/status", solicitacaoId)
				.cookie(acesso)
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"status\": \"%s\"}".formatted(novoStatus));
	}

	@Test
	void pedidosExigemLogin() throws Exception {
		mvc.perform(post("/solicitacoes").contentType(MediaType.APPLICATION_JSON).content(pedido(1L, AMANHA)))
				.andExpect(status().isUnauthorized());
		mvc.perform(get("/me/solicitacoes/feitas")).andExpect(status().isUnauthorized());
		mvc.perform(get("/me/solicitacoes/recebidas")).andExpect(status().isUnauthorized());
	}

	@Test
	void fluxoCompletoDoPedidoAteAEntrega() throws Exception {
		ContaDeTeste doador = cadastrar();
		ContaDeTeste quemPede = cadastrar();
		Long doacaoId = cadastrarDoacao(doador);

		// 1. Pede: o pedido começa Pendente, a doação passa a Solicitada e o telefone do doador ainda não aparece
		Long pedidoId = lerId(mvc.perform(pedir(doacaoId, AMANHA, quemPede.acesso()))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.status").value("Pendente"))
				.andExpect(jsonPath("$.doacao.contato").value(nullValue()))
				.andReturn().getResponse());
		mvc.perform(get("/doacoes/{id}", doacaoId)).andExpect(jsonPath("$.status").value("Solicitada"));

		// 2. O doador vê o pedido, com o telefone de quem pediu
		mvc.perform(get("/me/solicitacoes/recebidas").cookie(doador.acesso()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(1)))
				.andExpect(jsonPath("$[0].id").value(pedidoId.intValue()))
				.andExpect(jsonPath("$[0].nome").value("ONG Teste"))
				.andExpect(jsonPath("$[0].contato").value("(81) 98888-0000"));

		// 3. Aceita: quem pediu passa a ver o telefone do doador (no pedido e na página da doação)
		mvc.perform(alterarStatus(pedidoId, "Aceita", doador.acesso()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.status").value("Aceita"));
		mvc.perform(get("/me/solicitacoes/feitas").cookie(quemPede.acesso()))
				.andExpect(jsonPath("$[0].status").value("Aceita"))
				.andExpect(jsonPath("$[0].doacao.contato").value("(81) 99999-0000"));
		mvc.perform(get("/doacoes/{id}", doacaoId).cookie(quemPede.acesso()))
				.andExpect(jsonPath("$.contato").value("(81) 99999-0000"));

		// 4. Entregue: o pedido e a doação ficam Concluída
		mvc.perform(alterarStatus(pedidoId, "Concluída", doador.acesso()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.status").value("Concluída"));
		mvc.perform(get("/doacoes/{id}", doacaoId)).andExpect(jsonPath("$.status").value("Concluída"));
	}

	@Test
	void regrasParaPedir() throws Exception {
		ContaDeTeste doador = cadastrar();
		ContaDeTeste quemPede = cadastrar();
		Long doacaoId = cadastrarDoacao(doador); // vence daqui a 5 dias

		mvc.perform(pedir(doacaoId, AMANHA, doador.acesso()))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.campos.doacaoId").value("Esta doação é sua: não dá para solicitá-la."));

		mvc.perform(pedir(doacaoId, LocalDate.now().plusDays(10), quemPede.acesso()))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.campos.dataRetirada").value(containsString("escolha uma data até lá")));

		mvc.perform(pedir(doacaoId, LocalDate.now().minusDays(1), quemPede.acesso()))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.campos.dataRetirada").value("A data não pode estar no passado."));

		// O primeiro pedido dá certo; o segundo da mesma pessoa, não
		mvc.perform(pedir(doacaoId, AMANHA, quemPede.acesso())).andExpect(status().isCreated());
		mvc.perform(pedir(doacaoId, AMANHA, quemPede.acesso()))
				.andExpect(status().isConflict())
				.andExpect(jsonPath("$.message").value("Você já tem um pedido em aberto para esta doação."));

		// Outra pessoa também não consegue: com um pedido em andamento, a doação está Solicitada
		mvc.perform(pedir(doacaoId, AMANHA, cadastrar().acesso()))
				.andExpect(status().isConflict())
				.andExpect(jsonPath("$.message").value("Esta doação não está mais disponível para pedidos."));

		// Doação de exemplo que já foi entregue
		mvc.perform(pedir(idDoExemplo("Lentilha e Grão-de-Bico"), AMANHA, quemPede.acesso()))
				.andExpect(status().isConflict());
	}

	@Test
	void soQuemPediuOuODoadorMudamOStatus() throws Exception {
		ContaDeTeste doador = cadastrar();
		ContaDeTeste quemPede = cadastrar();
		Long doacaoId = cadastrarDoacao(doador);
		Long pedidoId = lerId(mvc.perform(pedir(doacaoId, AMANHA, quemPede.acesso())).andReturn().getResponse());

		// Nem pediu nem é o doador
		mvc.perform(alterarStatus(pedidoId, "Cancelada", cadastrar().acesso())).andExpect(status().isForbidden());
		// Quem pediu não aceita o próprio pedido
		mvc.perform(alterarStatus(pedidoId, "Aceita", quemPede.acesso())).andExpect(status().isForbidden());
		// Entregue antes de aceitar
		mvc.perform(alterarStatus(pedidoId, "Concluída", doador.acesso())).andExpect(status().isConflict());

		// Quem pediu cancela: a doação volta a ficar Disponível
		mvc.perform(alterarStatus(pedidoId, "Cancelada", quemPede.acesso()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.status").value("Cancelada"));
		mvc.perform(get("/doacoes/{id}", doacaoId)).andExpect(jsonPath("$.status").value("Disponível"));

		// Pedido encerrado não muda mais
		mvc.perform(alterarStatus(pedidoId, "Aceita", doador.acesso())).andExpect(status().isConflict());
	}

	@Test
	void cancelarADoacaoCancelaOsPedidosEmAberto() throws Exception {
		ContaDeTeste doador = cadastrar();
		ContaDeTeste quemPede = cadastrar();
		Long doacaoId = cadastrarDoacao(doador);
		mvc.perform(pedir(doacaoId, AMANHA, quemPede.acesso())).andExpect(status().isCreated());

		mvc.perform(patch("/doacoes/{id}/status", doacaoId)
				.cookie(doador.acesso())
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"status\": \"Cancelada\"}"))
				.andExpect(status().isOk());

		mvc.perform(get("/me/solicitacoes/feitas").cookie(quemPede.acesso()))
				.andExpect(jsonPath("$[0].status").value("Cancelada"));
	}

	@Test
	void entregarADoacaoContaOPedidoAceitoComoEntregue() throws Exception {
		ContaDeTeste doador = cadastrar();
		ContaDeTeste quemPede = cadastrar();
		Long doacaoId = cadastrarDoacao(doador);
		Long pedidoId = lerId(mvc.perform(pedir(doacaoId, AMANHA, quemPede.acesso()))
				.andExpect(status().isCreated())
				.andReturn().getResponse());
		mvc.perform(alterarStatus(pedidoId, "Aceita", doador.acesso())).andExpect(status().isOk());

		// O doador marca a doação (e não o pedido) como entregue, pelo botão de "Minhas doações"
		mvc.perform(patch("/doacoes/{id}/status", doacaoId)
				.cookie(doador.acesso())
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"status\": \"Concluída\"}"))
				.andExpect(status().isOk());

		// Quem pediu recebeu o alimento: o pedido aceito conta como entregue, e não como recusado
		mvc.perform(get("/me/solicitacoes/feitas").cookie(quemPede.acesso()))
				.andExpect(jsonPath("$[0].status").value("Concluída"));
	}

	@Test
	void exemplosTemPedidosDeVerdade() throws Exception {
		// 6 pedidos em aberto (as doações "Solicitada") + 5 já entregues (as doações "Concluída")
		mvc.perform(get("/me/solicitacoes/feitas").cookie(entrar("pedidos@farnel.dev", SENHA_DOS_EXEMPLOS)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(11)));
	}
}
