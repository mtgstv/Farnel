package br.com.farnel.api.solicitacao;

import com.fasterxml.jackson.annotation.JsonValue;

// As opções fixas de um pedido: as mesmas listas do front-end (src/data/opcoesDoacao.js).
// No banco fica o nome do enum (ex.: PENDENTE); no JSON vai e volta o texto da tela (ex.: "Pendente").
public final class OpcoesSolicitacao {

	private OpcoesSolicitacao() {
	}

	// Pendente → Aceita → Concluída (entregue); ou Recusada (pelo doador) / Cancelada (por quem pediu)
	public enum StatusSolicitacao {
		PENDENTE("Pendente"),
		ACEITA("Aceita"),
		CONCLUIDA("Concluída"),
		RECUSADA("Recusada"),
		CANCELADA("Cancelada");

		private final String rotulo;

		StatusSolicitacao(String rotulo) {
			this.rotulo = rotulo;
		}

		@JsonValue
		public String rotulo() {
			return rotulo;
		}
	}

	public enum TipoSolicitante {
		PESSOA_FISICA("Pessoa física"),
		ONG_INSTITUICAO("ONG ou instituição"),
		COZINHA_SOLIDARIA("Cozinha solidária"),
		ESCOLA_CRECHE("Escola ou creche");

		private final String rotulo;

		TipoSolicitante(String rotulo) {
			this.rotulo = rotulo;
		}

		@JsonValue
		public String rotulo() {
			return rotulo;
		}
	}

	public enum FormaRecebimento {
		RETIRAR_NO_LOCAL("Vou retirar no local"),
		PRECISA_ENTREGA("Preciso de entrega"),
		A_COMBINAR("A combinar");

		private final String rotulo;

		FormaRecebimento(String rotulo) {
			this.rotulo = rotulo;
		}

		@JsonValue
		public String rotulo() {
			return rotulo;
		}
	}
}
