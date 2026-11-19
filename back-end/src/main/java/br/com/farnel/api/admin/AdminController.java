package br.com.farnel.api.admin;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import br.com.farnel.api.admin.AdminDtos.AlterarPapelRequest;
import br.com.farnel.api.admin.AdminDtos.DoacaoAdminResponse;
import br.com.farnel.api.admin.AdminDtos.PainelGeralResponse;
import br.com.farnel.api.admin.AdminDtos.UsuarioAdminResponse;
import br.com.farnel.api.doacao.DoacaoDtos.AlterarStatusRequest;
import br.com.farnel.api.instituicao.InstituicaoDtos.InstituicaoAdminResponse;
import br.com.farnel.api.instituicao.InstituicaoDtos.VerificacaoRequest;
import br.com.farnel.api.instituicao.InstituicaoService;
import br.com.farnel.api.usuario.UsuarioLogado;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

// Área administrativa. Tudo em /admin exige papel ADMIN (regra do SecurityConfig): os outros recebem 403.
@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

	private final AdminService admin;
	private final InstituicaoService instituicoes;

	@GetMapping("/painel")
	public PainelGeralResponse painel() {
		return admin.painel();
	}

	@GetMapping("/doacoes")
	public List<DoacaoAdminResponse> doacoes() {
		return admin.listarDoacoes();
	}

	// Moderação: { "status": "Cancelada" }
	@PatchMapping("/doacoes/{id}/status")
	public DoacaoAdminResponse cancelarDoacao(@PathVariable Long id, @Valid @RequestBody AlterarStatusRequest dados) {
		return admin.cancelarDoacao(id, dados.status());
	}

	@GetMapping("/usuarios")
	public List<UsuarioAdminResponse> usuarios() {
		return admin.listarUsuarios();
	}

	// { "papel": "ADMIN" } ou { "papel": "USUARIO" }
	@PatchMapping("/usuarios/{id}/papel")
	public UsuarioAdminResponse alterarPapel(@PathVariable Long id, @AuthenticationPrincipal Jwt token,
			@Valid @RequestBody AlterarPapelRequest dados) {
		return admin.alterarPapel(UsuarioLogado.id(token), id, dados.papel());
	}

	// Todas as instituições (contas "ONG ou instituição"), as que esperam verificação primeiro
	@GetMapping("/instituicoes")
	public List<InstituicaoAdminResponse> instituicoes() {
		return instituicoes.listarTodas();
	}

	// { "verificada": true } ou { "verificada": false }
	@PatchMapping("/instituicoes/{id}/verificacao")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void verificarInstituicao(@PathVariable Long id, @Valid @RequestBody VerificacaoRequest dados) {
		instituicoes.alterarVerificacao(id, dados.verificada());
	}
}
