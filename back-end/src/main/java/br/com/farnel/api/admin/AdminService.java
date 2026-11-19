package br.com.farnel.api.admin;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.farnel.api.admin.AdminDtos.DoacaoAdminResponse;
import br.com.farnel.api.admin.AdminDtos.PainelGeralResponse;
import br.com.farnel.api.admin.AdminDtos.UsuarioAdminResponse;
import br.com.farnel.api.admin.AdminRepository.ContagemPorConta;
import br.com.farnel.api.comum.ErroApiException;
import br.com.farnel.api.comum.RecursoNaoEncontradoException;
import br.com.farnel.api.doacao.Doacao;
import br.com.farnel.api.doacao.DoacaoRepository;
import br.com.farnel.api.doacao.OpcoesDoacao.StatusDoacao;
import br.com.farnel.api.painel.Contagens;
import br.com.farnel.api.painel.PainelRepository.Contagem;
import br.com.farnel.api.solicitacao.OpcoesSolicitacao.StatusSolicitacao;
import br.com.farnel.api.solicitacao.SolicitacaoService;
import br.com.farnel.api.usuario.Papel;
import br.com.farnel.api.usuario.Usuario;
import br.com.farnel.api.usuario.UsuarioRepository;

import lombok.RequiredArgsConstructor;

// Regras da área administrativa. Só chega aqui quem tem papel ADMIN: o SecurityConfig bloqueia /admin/** para os outros (403).
@Service
@RequiredArgsConstructor
public class AdminService {

	private final AdminRepository admin;
	private final DoacaoRepository doacoes;
	private final UsuarioRepository usuarios;
	private final SolicitacaoService pedidos;

	@Transactional(readOnly = true)
	public PainelGeralResponse painel() {
		List<Contagem> porSituacao = admin.doacoesPorSituacao(LocalDate.now());
		List<Contagem> porPedido = admin.pedidosPorStatus();
		Map<String, Long> porPapel = admin.contasPorPapel().stream()
				.collect(Collectors.toMap(Contagem::getChave, Contagem::getTotal));

		return new PainelGeralResponse(
				porPapel.values().stream().mapToLong(Long::longValue).sum(),
				porPapel.getOrDefault(Papel.ADMIN.name(), 0L),
				admin.instituicoes(),
				admin.doadores(),
				Contagens.soma(porSituacao),
				Contagens.doacoesPorSituacao(porSituacao),
				Contagens.doacoesPorCategoria(admin.doacoesPorCategoria()),
				Contagens.entreguePorUnidade(admin.entreguePorUnidade()),
				Contagens.soma(porPedido),
				Contagens.pedidosPorStatus(porPedido),
				admin.pessoasAtendidas());
	}

	// Todas as doações do site, as mais recentes primeiro
	@Transactional(readOnly = true)
	public List<DoacaoAdminResponse> listarDoacoes() {
		return doacoes.findAllByOrderByCriadoEmDesc().stream().map(DoacaoAdminResponse::de).toList();
	}

	// Moderação: o administrador pode cancelar qualquer doação (ex.: alimento impróprio ou anúncio falso).
	// Os pedidos que estavam em aberto nela são cancelados junto.
	@Transactional
	public DoacaoAdminResponse cancelarDoacao(Long doacaoId, StatusDoacao novoStatus) {
		Doacao doacao = doacoes.findComDonoById(doacaoId)
				.orElseThrow(() -> new RecursoNaoEncontradoException("Doação não encontrada."));

		if (novoStatus != StatusDoacao.CANCELADA) {
			throw new ErroApiException(HttpStatus.BAD_REQUEST, "Na moderação, a doação só pode ser cancelada.");
		}
		if (doacao.estaEncerrada()) {
			throw new ErroApiException(HttpStatus.CONFLICT, "Esta doação já foi encerrada.");
		}

		doacao.encerrar(StatusDoacao.CANCELADA);
		pedidos.encerrarPedidosEmAberto(doacao.getId(), StatusSolicitacao.CANCELADA);
		return DoacaoAdminResponse.de(doacao);
	}

	// Todas as contas, as mais novas primeiro, com quantas doações e pedidos cada uma tem
	@Transactional(readOnly = true)
	public List<UsuarioAdminResponse> listarUsuarios() {
		Map<Long, Long> doacoesPorConta = mapa(admin.doacoesPorConta());
		Map<Long, Long> pedidosPorConta = mapa(admin.pedidosPorConta());

		return usuarios.findAll(Sort.by(Sort.Direction.DESC, "criadoEm")).stream()
				.map(usuario -> UsuarioAdminResponse.de(usuario,
						doacoesPorConta.getOrDefault(usuario.getId(), 0L),
						pedidosPorConta.getOrDefault(usuario.getId(), 0L)))
				.toList();
	}

	@Transactional
	public UsuarioAdminResponse alterarPapel(Long administradorId, Long usuarioId, Papel novoPapel) {
		// Evita que o único administrador tire o próprio acesso sem querer
		if (administradorId.equals(usuarioId)) {
			throw new ErroApiException(HttpStatus.CONFLICT, "Você não pode mudar o seu próprio papel.");
		}

		Usuario usuario = usuarios.findById(usuarioId)
				.orElseThrow(() -> new RecursoNaoEncontradoException("Usuário não encontrado."));
		usuario.mudarPapel(novoPapel);

		// O novo papel vale a partir do próximo token de acesso dessa pessoa (em até 15 minutos, ou ao entrar de novo)
		return UsuarioAdminResponse.de(usuario,
				mapa(admin.doacoesPorConta()).getOrDefault(usuarioId, 0L),
				mapa(admin.pedidosPorConta()).getOrDefault(usuarioId, 0L));
	}

	private static Map<Long, Long> mapa(List<ContagemPorConta> contagens) {
		return contagens.stream().collect(Collectors.toMap(ContagemPorConta::getId, ContagemPorConta::getTotal));
	}
}
