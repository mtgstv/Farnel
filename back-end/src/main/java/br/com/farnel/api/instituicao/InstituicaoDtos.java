package br.com.farnel.api.instituicao;

import jakarta.validation.constraints.NotNull;

public final class InstituicaoDtos {

	private InstituicaoDtos() {
	}

	// Lista pública de instituições verificadas (sem e-mail)
	public record InstituicaoResponse(Long id, String nome, String cidade, String uf, String sobre, String foto,
			long doacoesRecebidas) {

		static InstituicaoResponse de(InstituicaoRepository.Linha linha) {
			return new InstituicaoResponse(linha.getId(), linha.getNome(), linha.getCidade(), linha.getUf(),
					linha.getSobre(), linha.getFoto(), linha.getDoacoesRecebidas());
		}
	}

	// "Gerenciar instituições" (só administradores): com e-mail e a situação da verificação
	public record InstituicaoAdminResponse(Long id, String nome, String email, String cidade, String uf, String sobre,
			boolean verificada, long doacoesRecebidas) {

		static InstituicaoAdminResponse de(InstituicaoRepository.Linha linha) {
			return new InstituicaoAdminResponse(linha.getId(), linha.getNome(), linha.getEmail(), linha.getCidade(),
					linha.getUf(), linha.getSobre(), Boolean.TRUE.equals(linha.getVerificada()), linha.getDoacoesRecebidas());
		}
	}

	// Corpo do PATCH /admin/instituicoes/{id}/verificacao: { "verificada": true }
	public record VerificacaoRequest(
			@NotNull(message = "Informe se a instituição está verificada.")
			Boolean verificada) {
	}
}
