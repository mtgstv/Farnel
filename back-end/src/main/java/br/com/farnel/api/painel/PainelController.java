package br.com.farnel.api.painel;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.farnel.api.usuario.UsuarioLogado;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class PainelController {

	private final PainelService painel;

	// Os números de quem está logado (página "Meu painel"); exige login, como tudo em /me
	@GetMapping("/me/painel")
	public PainelResponse buscar(@AuthenticationPrincipal Jwt token) {
		return painel.montar(UsuarioLogado.id(token));
	}
}
