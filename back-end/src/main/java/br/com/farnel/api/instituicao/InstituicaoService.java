package br.com.farnel.api.instituicao;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.farnel.api.comum.ErroApiException;
import br.com.farnel.api.comum.RecursoNaoEncontradoException;
import br.com.farnel.api.instituicao.InstituicaoDtos.InstituicaoAdminResponse;
import br.com.farnel.api.instituicao.InstituicaoDtos.InstituicaoResponse;
import br.com.farnel.api.usuario.Usuario;
import br.com.farnel.api.usuario.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InstituicaoService {

	private final InstituicaoRepository instituicoes;
	private final UsuarioRepository usuarios;

	@Transactional(readOnly = true)
	public List<InstituicaoResponse> listarVerificadas() {
		return instituicoes.verificadas().stream().map(InstituicaoResponse::de).toList();
	}

	@Transactional(readOnly = true)
	public List<InstituicaoAdminResponse> listarTodas() {
		return instituicoes.todas().stream().map(InstituicaoAdminResponse::de).toList();
	}

	// O administrador marca (ou desmarca) a instituição como verificada
	@Transactional
	public void alterarVerificacao(Long usuarioId, boolean verificada) {
		Usuario usuario = usuarios.findById(usuarioId)
				.orElseThrow(() -> new RecursoNaoEncontradoException("Instituição não encontrada."));

		if (!usuario.ehInstituicao()) {
			throw new ErroApiException(HttpStatus.CONFLICT,
					"Esta conta não participa como ONG ou instituição, então não pode ser verificada.");
		}

		usuario.marcarVerificada(verificada);
	}
}
