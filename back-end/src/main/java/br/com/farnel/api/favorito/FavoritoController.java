package br.com.farnel.api.favorito;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import br.com.farnel.api.doacao.DoacaoDtos.DoacaoResponse;
import br.com.farnel.api.usuario.UsuarioLogado;

import lombok.RequiredArgsConstructor;

// Os favoritos de quem está logado (tudo em /me exige login, ver SecurityConfig)
@RestController
@RequestMapping("/me/favoritos")
@RequiredArgsConstructor
public class FavoritoController {

	private final FavoritoService favoritos;

	@GetMapping
	public List<DoacaoResponse> listar(@AuthenticationPrincipal Jwt token) {
		return favoritos.listar(UsuarioLogado.id(token));
	}

	// PUT porque repetir a chamada não muda o resultado (a doação continua favoritada)
	@PutMapping("/{doacaoId}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void adicionar(@AuthenticationPrincipal Jwt token, @PathVariable Long doacaoId) {
		favoritos.adicionar(UsuarioLogado.id(token), doacaoId);
	}

	@DeleteMapping("/{doacaoId}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void remover(@AuthenticationPrincipal Jwt token, @PathVariable Long doacaoId) {
		favoritos.remover(UsuarioLogado.id(token), doacaoId);
	}
}
