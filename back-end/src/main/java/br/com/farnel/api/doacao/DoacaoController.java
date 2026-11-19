package br.com.farnel.api.doacao;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import br.com.farnel.api.doacao.DoacaoDtos.AlterarStatusRequest;
import br.com.farnel.api.doacao.DoacaoDtos.DoacaoRequest;
import br.com.farnel.api.doacao.DoacaoDtos.DoacaoResponse;
import br.com.farnel.api.usuario.UsuarioLogado;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

// GET /doacoes e GET /doacoes/{id} são públicos (liberados no SecurityConfig); o resto exige login.
// Nas rotas públicas, o token vem nulo para visitantes.
@RestController
@RequiredArgsConstructor
public class DoacaoController {

	private final DoacaoService doacoes;

	@GetMapping("/doacoes")
	public List<DoacaoResponse> listar(@AuthenticationPrincipal Jwt token) {
		return doacoes.listar(idOuNulo(token));
	}

	@GetMapping("/doacoes/{id}")
	public DoacaoResponse buscar(@PathVariable Long id, @AuthenticationPrincipal Jwt token) {
		return doacoes.buscar(id, idOuNulo(token));
	}

	// As doações de quem está logado (página "Minhas doações")
	@GetMapping("/me/doacoes")
	public List<DoacaoResponse> minhas(@AuthenticationPrincipal Jwt token) {
		return doacoes.listarDoUsuario(UsuarioLogado.id(token));
	}

	// 201 Created, com o endereço da doação nova no cabeçalho Location
	@PostMapping("/doacoes")
	public ResponseEntity<DoacaoResponse> cadastrar(@AuthenticationPrincipal Jwt token,
			@Valid @RequestBody DoacaoRequest dados) {
		DoacaoResponse criada = doacoes.cadastrar(UsuarioLogado.id(token), dados);
		URI endereco = ServletUriComponentsBuilder.fromCurrentRequest()
				.path("/{id}")
				.buildAndExpand(criada.id())
				.toUri();
		return ResponseEntity.created(endereco).body(criada);
	}

	@PatchMapping("/doacoes/{id}/status")
	public DoacaoResponse alterarStatus(@PathVariable Long id, @AuthenticationPrincipal Jwt token,
			@Valid @RequestBody AlterarStatusRequest dados) {
		return doacoes.alterarStatus(UsuarioLogado.id(token), id, dados.status());
	}

	// Visitante: sem token, sem id
	private static Long idOuNulo(Jwt token) {
		return token == null ? null : UsuarioLogado.id(token);
	}
}
