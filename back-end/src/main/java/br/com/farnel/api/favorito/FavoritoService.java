package br.com.farnel.api.favorito;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.farnel.api.comum.ErroApiException;
import br.com.farnel.api.comum.RecursoNaoEncontradoException;
import br.com.farnel.api.doacao.Doacao;
import br.com.farnel.api.doacao.DoacaoDtos.DoacaoResponse;
import br.com.farnel.api.doacao.DoacaoRepository;
import br.com.farnel.api.doacao.DoacaoService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FavoritoService {

	private final FavoritoRepository favoritos;
	private final DoacaoRepository doacoes;
	private final DoacaoService doacaoService;

	// As favoritas mais recentes primeiro (o telefone do doador segue a mesma regra da lista de doações)
	@Transactional(readOnly = true)
	public List<DoacaoResponse> listar(Long usuarioId) {
		List<Doacao> favoritas = favoritos.findByUsuarioIdOrderByCriadoEmDesc(usuarioId).stream()
				.map(Favorito::getDoacao)
				.toList();
		return doacaoService.paraQuemVe(favoritas, usuarioId);
	}

	@Transactional
	public void adicionar(Long usuarioId, Long doacaoId) {
		Doacao doacao = doacoes.findById(doacaoId)
				.orElseThrow(() -> new RecursoNaoEncontradoException("Doação não encontrada."));

		// Mesma regra da tela: doação encerrada não entra nos favoritos (mas quem já tinha pode remover)
		if (doacao.estaEncerrada() || doacao.estaVencida()) {
			throw new ErroApiException(HttpStatus.CONFLICT,
					"Doações vencidas, entregues ou canceladas não podem ser favoritadas.");
		}

		favoritos.adicionar(usuarioId, doacaoId);
	}

	// Remover o que não estava nos favoritos não é erro: o resultado é o mesmo (a doação fora da lista)
	@Transactional
	public void remover(Long usuarioId, Long doacaoId) {
		favoritos.remover(usuarioId, doacaoId);
	}
}
