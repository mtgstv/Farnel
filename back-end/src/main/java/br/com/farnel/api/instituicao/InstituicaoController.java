package br.com.farnel.api.instituicao;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.farnel.api.instituicao.InstituicaoDtos.InstituicaoResponse;

import lombok.RequiredArgsConstructor;

// Lista pública (liberada no SecurityConfig). A verificação fica na área administrativa (AdminController).
@RestController
@RequiredArgsConstructor
public class InstituicaoController {

	private final InstituicaoService instituicoes;

	// As instituições verificadas, com quantas doações cada uma já recebeu
	@GetMapping("/instituicoes")
	public List<InstituicaoResponse> listar() {
		return instituicoes.listarVerificadas();
	}
}
