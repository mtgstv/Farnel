package br.com.farnel.api.solicitacao;

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

import br.com.farnel.api.solicitacao.SolicitacaoDtos.AlterarStatusSolicitacaoRequest;
import br.com.farnel.api.solicitacao.SolicitacaoDtos.SolicitacaoRequest;
import br.com.farnel.api.solicitacao.SolicitacaoDtos.SolicitacaoResponse;
import br.com.farnel.api.usuario.UsuarioLogado;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

// Todas as rotas de pedidos exigem login (caem no anyRequest().authenticated() do SecurityConfig)
@RestController
@RequiredArgsConstructor
public class SolicitacaoController {

	private final SolicitacaoService solicitacoes;

	// 201 Created, com o endereço do pedido novo no cabeçalho Location
	@PostMapping("/solicitacoes")
	public ResponseEntity<SolicitacaoResponse> solicitar(@AuthenticationPrincipal Jwt token,
			@Valid @RequestBody SolicitacaoRequest dados) {
		SolicitacaoResponse criada = solicitacoes.solicitar(UsuarioLogado.id(token), dados);
		URI endereco = ServletUriComponentsBuilder.fromCurrentRequest()
				.path("/{id}")
				.buildAndExpand(criada.id())
				.toUri();
		return ResponseEntity.created(endereco).body(criada);
	}

	// Pedidos que a pessoa logada fez
	@GetMapping("/me/solicitacoes/feitas")
	public List<SolicitacaoResponse> feitas(@AuthenticationPrincipal Jwt token) {
		return solicitacoes.listarFeitas(UsuarioLogado.id(token));
	}

	// Pedidos recebidos nas doações da pessoa logada
	@GetMapping("/me/solicitacoes/recebidas")
	public List<SolicitacaoResponse> recebidas(@AuthenticationPrincipal Jwt token) {
		return solicitacoes.listarRecebidas(UsuarioLogado.id(token));
	}

	@PatchMapping("/solicitacoes/{id}/status")
	public SolicitacaoResponse alterarStatus(@PathVariable Long id, @AuthenticationPrincipal Jwt token,
			@Valid @RequestBody AlterarStatusSolicitacaoRequest dados) {
		return solicitacoes.alterarStatus(UsuarioLogado.id(token), id, dados.status());
	}
}
