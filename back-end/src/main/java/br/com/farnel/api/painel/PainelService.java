package br.com.farnel.api.painel;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.farnel.api.painel.PainelRepository.Contagem;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PainelService {

	private final PainelRepository painel;

	@Transactional(readOnly = true)
	public PainelResponse montar(Long usuarioId) {
		List<Contagem> porSituacao = painel.doacoesPorSituacao(usuarioId, LocalDate.now());

		return new PainelResponse(
				Contagens.soma(porSituacao),
				Contagens.doacoesPorSituacao(porSituacao),
				Contagens.doacoesPorCategoria(painel.doacoesPorCategoria(usuarioId)),
				Contagens.entreguePorUnidade(painel.entreguePorUnidade(usuarioId)),
				painel.pessoasAtendidas(usuarioId),
				Contagens.pedidosPorStatus(painel.pedidosFeitosPorStatus(usuarioId)),
				Contagens.pedidosPorStatus(painel.pedidosRecebidosPorStatus(usuarioId)),
				painel.favoritos(usuarioId));
	}
}
