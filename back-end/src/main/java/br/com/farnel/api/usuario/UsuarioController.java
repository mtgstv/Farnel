package br.com.farnel.api.usuario;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import br.com.farnel.api.usuario.UsuarioDtos.PerfilRequest;
import br.com.farnel.api.usuario.UsuarioDtos.TrocarSenhaRequest;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

// A conta de quem está logado (tudo em /me exige login)
@RestController
@RequiredArgsConstructor
public class UsuarioController {

	private final UsuarioService usuarios;

	// Dados da conta e do perfil
	@GetMapping("/me")
	public UsuarioResponse buscarPerfil(@AuthenticationPrincipal Jwt token) {
		return usuarios.buscar(UsuarioLogado.id(token));
	}

	// Salva o perfil inteiro (PUT: o corpo traz todos os campos do formulário)
	@PutMapping("/me")
	public UsuarioResponse atualizarPerfil(@AuthenticationPrincipal Jwt token, @Valid @RequestBody PerfilRequest dados) {
		return usuarios.atualizarPerfil(UsuarioLogado.id(token), dados);
	}

	@PatchMapping("/me/senha")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void trocarSenha(@AuthenticationPrincipal Jwt token, @Valid @RequestBody TrocarSenhaRequest dados) {
		usuarios.trocarSenha(UsuarioLogado.id(token), dados);
	}
}
