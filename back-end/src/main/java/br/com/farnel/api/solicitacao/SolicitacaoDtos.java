package br.com.farnel.api.solicitacao;

import java.time.Instant;
import java.time.LocalDate;

import br.com.farnel.api.comum.Formatos;
import br.com.farnel.api.doacao.DoacaoDtos.DoacaoResponse;
import br.com.farnel.api.solicitacao.OpcoesSolicitacao.FormaRecebimento;
import br.com.farnel.api.solicitacao.OpcoesSolicitacao.StatusSolicitacao;
import br.com.farnel.api.solicitacao.OpcoesSolicitacao.TipoSolicitante;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

// Formatos do JSON dos pedidos. Os nomes dos campos são os mesmos do formulário do front
// (pages/Doacoes/NovaSolicitacao.jsx), então cada erro cai direto no campo certo da tela.
public final class SolicitacaoDtos {

	private SolicitacaoDtos() {
	}

	// Corpo do POST /solicitacoes, com as mesmas regras do formulário do front.
	// As regras que dependem da doação (disponível, não ser sua, retirada até a validade) ficam no SolicitacaoService.
	public record SolicitacaoRequest(
			@NotNull(message = "Escolha a doação que você quer solicitar.")
			Long doacaoId,

			@NotNull(message = "Diga como você está pedindo.")
			TipoSolicitante tipoSolicitante,

			@NotBlank(message = "Informe seu nome ou o da instituição.")
			@Size(min = 3, max = 150, message = "Informe seu nome ou o da instituição.")
			String nome,

			@NotBlank(message = "Informe um telefone com DDD.")
			@Size(max = 20, message = "Informe um telefone com DDD.")
			@Pattern(regexp = Formatos.TELEFONE, message = "Informe um telefone com DDD.")
			String contato,

			@NotBlank(message = "Informe quanto você precisa (ou \"tudo\").")
			@Size(max = 50, message = "Use até 50 caracteres na quantidade.")
			String quantidade,

			@NotNull(message = "Escolha uma data para a retirada.")
			@FutureOrPresent(message = "A data não pode estar no passado.")
			LocalDate dataRetirada,

			@Size(max = 100, message = "O horário pode ter até 100 caracteres.")
			String horario,

			@NotNull(message = "Escolha como você vai receber o alimento.")
			FormaRecebimento forma,

			@Size(max = 500, message = "A mensagem pode ter até 500 caracteres.")
			String mensagem) {
	}

	// Corpo do PATCH /solicitacoes/{id}/status: "Aceita", "Recusada", "Concluída" (entregue) ou "Cancelada"
	public record AlterarStatusSolicitacaoRequest(
			@NotNull(message = "Informe o novo status.")
			StatusSolicitacao status) {
	}

	// O que a API devolve sobre um pedido, já com a doação pedida
	public record SolicitacaoResponse(
			Long id,
			StatusSolicitacao status,
			TipoSolicitante tipoSolicitante,
			String nome,
			// Telefone de quem pediu (o doador usa para combinar a retirada)
			String contato,
			String quantidade,
			LocalDate dataRetirada,
			String horario,
			FormaRecebimento forma,
			String mensagem,
			Instant criadoEm,
			Long solicitanteId,
			// O telefone do doador (doacao.contato) só vem depois que o pedido é aceito
			DoacaoResponse doacao) {

		public static SolicitacaoResponse de(Solicitacao solicitacao, boolean mostrarContatoDoDoador) {
			return new SolicitacaoResponse(
					solicitacao.getId(),
					solicitacao.getStatus(),
					solicitacao.getTipoSolicitante(),
					solicitacao.getNome(),
					solicitacao.getContato(),
					solicitacao.getQuantidade(),
					solicitacao.getDataRetirada(),
					solicitacao.getHorario(),
					solicitacao.getForma(),
					solicitacao.getMensagem(),
					solicitacao.getCriadoEm(),
					solicitacao.getSolicitante().getId(),
					DoacaoResponse.de(solicitacao.getDoacao(), mostrarContatoDoDoador));
		}
	}
}
