package br.com.farnel.api.doacao;

import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.farnel.api.comum.CamposInvalidosException;
import br.com.farnel.api.comum.ErroApiException;
import br.com.farnel.api.comum.RecursoNaoEncontradoException;
import br.com.farnel.api.doacao.DoacaoDtos.DoacaoRequest;
import br.com.farnel.api.doacao.DoacaoDtos.DoacaoResponse;
import br.com.farnel.api.doacao.OpcoesDoacao.StatusDoacao;
import br.com.farnel.api.doacao.OpcoesDoacao.TipoRetirada;
import br.com.farnel.api.solicitacao.OpcoesSolicitacao.StatusSolicitacao;
import br.com.farnel.api.solicitacao.SolicitacaoService;
import br.com.farnel.api.usuario.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DoacaoService {

	private final DoacaoRepository doacoes;
	private final UsuarioRepository usuarios;
	private final SolicitacaoService pedidos;

	// Lista pública. usuarioId é nulo para visitantes.
	@Transactional(readOnly = true)
	public List<DoacaoResponse> listar(Long usuarioId) {
		return paraQuemVe(doacoes.findAllByOrderByIdAsc(), usuarioId);
	}

	@Transactional(readOnly = true)
	public DoacaoResponse buscar(Long id, Long usuarioId) {
		return paraQuemVe(List.of(encontrar(id)), usuarioId).getFirst();
	}

	/*
	 * Monta a resposta de cada doação conforme quem está vendo: o telefone do doador só aparece
	 * para o próprio doador e para quem teve um pedido aceito nela (como na AV1). Visitante não vê.
	 * Também usado pela lista de favoritos.
	 */
	public List<DoacaoResponse> paraQuemVe(List<Doacao> lista, Long usuarioId) {
		Set<Long> liberadas = usuarioId == null ? Set.of() : doacoes.idsComPedidoAceito(usuarioId);
		return lista.stream()
				.map(doacao -> DoacaoResponse.de(doacao,
						usuarioId != null && (doacao.pertenceA(usuarioId) || liberadas.contains(doacao.getId()))))
				.toList();
	}

	// "Minhas doações": as mais recentes primeiro
	@Transactional(readOnly = true)
	public List<DoacaoResponse> listarDoUsuario(Long usuarioId) {
		return doacoes.findByUsuarioIdOrderByCriadoEmDesc(usuarioId).stream()
				.map(doacao -> DoacaoResponse.de(doacao, true))
				.toList();
	}

	@Transactional
	public DoacaoResponse cadastrar(Long usuarioId, DoacaoRequest dados) {
		// Regra que depende de dois campos, por isso não cabe numa anotação do DoacaoRequest
		if (dados.tipoRetirada() == TipoRetirada.RETIRADA_NO_LOCAL
				&& (dados.endereco() == null || dados.endereco().isBlank())) {
			throw new CamposInvalidosException(Map.of("endereco", "Informe o endereço de retirada."));
		}

		// getReferenceById não consulta o banco: só aponta para o usuário pelo id (o usuario_id da doação)
		Doacao doacao = new Doacao(usuarios.getReferenceById(usuarioId), dados);
		return DoacaoResponse.de(doacoes.save(doacao), true);
	}

	// Encerrar a doação: marcar como entregue (Concluída) ou cancelar
	@Transactional
	public DoacaoResponse alterarStatus(Long usuarioId, Long doacaoId, StatusDoacao novoStatus) {
		Doacao doacao = encontrar(doacaoId);

		if (!doacao.pertenceA(usuarioId)) {
			throw new ErroApiException(HttpStatus.FORBIDDEN, "Só quem cadastrou a doação pode alterar o status dela.");
		}
		if (novoStatus != StatusDoacao.CONCLUIDA && novoStatus != StatusDoacao.CANCELADA) {
			throw new ErroApiException(HttpStatus.BAD_REQUEST,
					"Uma doação só pode ser marcada como entregue (Concluída) ou cancelada.");
		}
		if (doacao.estaEncerrada()) {
			throw new ErroApiException(HttpStatus.CONFLICT, "Esta doação já foi encerrada.");
		}
		if (novoStatus == StatusDoacao.CONCLUIDA && doacao.estaVencida()) {
			throw new ErroApiException(HttpStatus.CONFLICT,
					"Uma doação vencida não pode ser marcada como entregue. Você pode cancelá-la.");
		}

		// Não precisa chamar save: dentro da transação, o JPA grava sozinho o que mudou na entidade
		doacao.encerrar(novoStatus);
		// Os pedidos que ainda estavam em aberto: cancelados junto com a doação; se ela foi entregue,
		// o pedido que o doador já tinha aceitado conta como entregue e os pendentes são recusados
		if (novoStatus == StatusDoacao.CANCELADA) {
			pedidos.encerrarPedidosEmAberto(doacao.getId(), StatusSolicitacao.CANCELADA);
		} else {
			pedidos.entregarPelaDoacao(doacao.getId());
		}

		return DoacaoResponse.de(doacao, true);
	}

	private Doacao encontrar(Long id) {
		return doacoes.findComAlergenicosById(id)
				.orElseThrow(() -> new RecursoNaoEncontradoException("Doação não encontrada."));
	}
}
