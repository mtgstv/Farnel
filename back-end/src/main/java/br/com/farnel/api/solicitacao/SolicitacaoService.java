package br.com.farnel.api.solicitacao;

import java.time.format.DateTimeFormatter;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.farnel.api.comum.CamposInvalidosException;
import br.com.farnel.api.comum.ErroApiException;
import br.com.farnel.api.comum.RecursoNaoEncontradoException;
import br.com.farnel.api.doacao.Doacao;
import br.com.farnel.api.doacao.DoacaoRepository;
import br.com.farnel.api.doacao.OpcoesDoacao.StatusDoacao;
import br.com.farnel.api.solicitacao.OpcoesSolicitacao.StatusSolicitacao;
import br.com.farnel.api.solicitacao.SolicitacaoDtos.SolicitacaoRequest;
import br.com.farnel.api.solicitacao.SolicitacaoDtos.SolicitacaoResponse;
import br.com.farnel.api.usuario.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SolicitacaoService {

	// Pedidos que ainda "seguram" a doação para quem pediu
	private static final Set<StatusSolicitacao> EM_ABERTO = EnumSet.of(StatusSolicitacao.PENDENTE, StatusSolicitacao.ACEITA);

	private static final DateTimeFormatter DATA_BR = DateTimeFormatter.ofPattern("dd/MM/yyyy");

	private final SolicitacaoRepository solicitacoes;
	private final DoacaoRepository doacoes;
	private final UsuarioRepository usuarios;

	@Transactional
	public SolicitacaoResponse solicitar(Long usuarioId, SolicitacaoRequest dados) {
		Doacao doacao = doacoes.findById(dados.doacaoId())
				.orElseThrow(() -> new RecursoNaoEncontradoException("Doação não encontrada."));

		if (doacao.pertenceA(usuarioId)) {
			throw new CamposInvalidosException(Map.of("doacaoId", "Esta doação é sua: não dá para solicitá-la."));
		}
		if (solicitacoes.existsByDoacaoIdAndSolicitanteIdAndStatusIn(doacao.getId(), usuarioId, EM_ABERTO)) {
			throw new ErroApiException(HttpStatus.CONFLICT, "Você já tem um pedido em aberto para esta doação.");
		}
		// Só doações Disponíveis e dentro da validade (com um pedido em andamento, ela fica Solicitada)
		if (doacao.getStatus() != StatusDoacao.DISPONIVEL || doacao.estaVencida()) {
			throw new ErroApiException(HttpStatus.CONFLICT, "Esta doação não está mais disponível para pedidos.");
		}
		if (dados.dataRetirada().isAfter(doacao.getValidade())) {
			throw new CamposInvalidosException(Map.of("dataRetirada",
					"A doação vence em " + DATA_BR.format(doacao.getValidade()) + ": escolha uma data até lá."));
		}

		Solicitacao nova = solicitacoes.save(new Solicitacao(doacao, usuarios.getReferenceById(usuarioId), dados));
		// Com um pedido em aberto, a doação passa a aparecer como "Solicitada"
		doacao.atualizarPelosPedidos(true);

		return SolicitacaoResponse.de(nova, false);
	}

	// Pedidos que a pessoa fez: o telefone do doador aparece depois que ele aceita
	@Transactional(readOnly = true)
	public List<SolicitacaoResponse> listarFeitas(Long usuarioId) {
		return solicitacoes.findBySolicitanteIdOrderByCriadoEmDesc(usuarioId).stream()
				.map(solicitacao -> SolicitacaoResponse.de(solicitacao, solicitacao.liberaContatoDoDoador()))
				.toList();
	}

	// Pedidos recebidos nas doações da pessoa (o telefone dela mesma sempre aparece)
	@Transactional(readOnly = true)
	public List<SolicitacaoResponse> listarRecebidas(Long usuarioId) {
		return solicitacoes.findByDoacaoUsuarioIdOrderByCriadoEmDesc(usuarioId).stream()
				.map(solicitacao -> SolicitacaoResponse.de(solicitacao, true))
				.toList();
	}

	/*
	 * Quem pediu só pode cancelar (enquanto o pedido está pendente ou aceito).
	 * O doador aceita ou recusa um pedido pendente e, depois da entrega, marca como entregue (Concluída).
	 */
	@Transactional
	public SolicitacaoResponse alterarStatus(Long usuarioId, Long solicitacaoId, StatusSolicitacao novoStatus) {
		Solicitacao solicitacao = solicitacoes.findById(solicitacaoId)
				.orElseThrow(() -> new RecursoNaoEncontradoException("Pedido não encontrado."));
		Doacao doacao = solicitacao.getDoacao();

		boolean ehQuemPediu = solicitacao.feitaPor(usuarioId);
		boolean ehODoador = doacao.pertenceA(usuarioId);

		if (!ehQuemPediu && !ehODoador) {
			throw new ErroApiException(HttpStatus.FORBIDDEN, "Este pedido não é seu nem foi feito numa doação sua.");
		}

		if (ehQuemPediu && novoStatus == StatusSolicitacao.CANCELADA) {
			exigir(solicitacao.estaAberta(), "Este pedido já foi encerrado.");
		} else if (ehODoador && (novoStatus == StatusSolicitacao.ACEITA || novoStatus == StatusSolicitacao.RECUSADA)) {
			exigir(solicitacao.getStatus() == StatusSolicitacao.PENDENTE, "Só dá para aceitar ou recusar um pedido pendente.");
		} else if (ehODoador && novoStatus == StatusSolicitacao.CONCLUIDA) {
			exigir(solicitacao.getStatus() == StatusSolicitacao.ACEITA, "Aceite o pedido antes de marcar como entregue.");
		} else {
			throw new ErroApiException(HttpStatus.FORBIDDEN, ehQuemPediu
					? "Quem fez o pedido só pode cancelá-lo."
					: "O doador pode aceitar, recusar ou marcar o pedido como entregue.");
		}

		solicitacao.mudarStatus(novoStatus);

		if (novoStatus == StatusSolicitacao.CONCLUIDA) {
			// Entregue: a doação termina, e os outros pedidos que ainda estavam em aberto são recusados
			doacao.encerrar(StatusDoacao.CONCLUIDA);
			encerrarPedidosEmAberto(doacao.getId(), StatusSolicitacao.RECUSADA);
		} else {
			// Sem nenhum pedido em aberto, a doação volta a ficar Disponível
			doacao.atualizarPelosPedidos(solicitacoes.existsByDoacaoIdAndStatusIn(doacao.getId(), EM_ABERTO));
		}

		return SolicitacaoResponse.de(solicitacao, ehODoador || solicitacao.liberaContatoDoDoador());
	}

	// Usado quando a doação é encerrada: cancelada pelo doador ou pelo administrador (pedidos cancelados junto),
	// ou entregue por outro pedido (os outros que estavam em aberto são recusados)
	@Transactional
	public void encerrarPedidosEmAberto(Long doacaoId, StatusSolicitacao novoStatus) {
		for (Solicitacao pedido : solicitacoes.findByDoacaoIdAndStatusIn(doacaoId, EM_ABERTO)) {
			pedido.mudarStatus(novoStatus);
		}
	}

	// O doador marcou a doação inteira como entregue (em "Minhas doações"), em vez de marcar o pedido:
	// o pedido que ele já tinha aceitado conta como entregue, e os que ainda estavam pendentes são recusados
	@Transactional
	public void entregarPelaDoacao(Long doacaoId) {
		for (Solicitacao pedido : solicitacoes.findByDoacaoIdAndStatusIn(doacaoId, EM_ABERTO)) {
			pedido.mudarStatus(pedido.getStatus() == StatusSolicitacao.ACEITA
					? StatusSolicitacao.CONCLUIDA
					: StatusSolicitacao.RECUSADA);
		}
	}

	private static void exigir(boolean condicao, String mensagem) {
		if (!condicao) {
			throw new ErroApiException(HttpStatus.CONFLICT, mensagem);
		}
	}
}
