package br.com.farnel.api.doacao;

import com.fasterxml.jackson.annotation.JsonValue;

// As opções fixas de uma doação: as mesmas listas do front-end (src/data/opcoesDoacao.js).
// No banco fica o nome do enum (ex.: GRAOS, pelo @Enumerated(EnumType.STRING) da entidade Doacao);
// no JSON vai e volta o texto da tela (ex.: "Grãos"), por causa do @JsonValue.
public final class OpcoesDoacao {

	private OpcoesDoacao() {
	}

	public enum Categoria {
		GRAOS("Grãos"),
		FRUTAS("Frutas"),
		VERDURAS("Verduras"),
		LEGUMES("Legumes"),
		ENLATADOS("Enlatados"),
		MASSAS("Massas"),
		BEBIDAS("Bebidas"),
		LATICINIOS("Laticínios"),
		PADARIA("Padaria"),
		OUTROS("Outros");

		private final String rotulo;

		Categoria(String rotulo) {
			this.rotulo = rotulo;
		}

		@JsonValue
		public String rotulo() {
			return rotulo;
		}
	}

	public enum Conservacao {
		TEMPERATURA_AMBIENTE("Temperatura ambiente"),
		REFRIGERADO("Refrigerado"),
		CONGELADO("Congelado");

		private final String rotulo;

		Conservacao(String rotulo) {
			this.rotulo = rotulo;
		}

		@JsonValue
		public String rotulo() {
			return rotulo;
		}
	}

	public enum TipoRetirada {
		RETIRADA_NO_LOCAL("Retirada no local"),
		ENTREGA_PELO_DOADOR("Entrega pelo doador"),
		A_COMBINAR("A combinar");

		private final String rotulo;

		TipoRetirada(String rotulo) {
			this.rotulo = rotulo;
		}

		@JsonValue
		public String rotulo() {
			return rotulo;
		}
	}

	// "Vencida" não está aqui: não é guardada, e sim calculada pela validade (ver Doacao.estaVencida)
	public enum StatusDoacao {
		DISPONIVEL("Disponível"),
		SOLICITADA("Solicitada"),
		CONCLUIDA("Concluída"),
		CANCELADA("Cancelada");

		private final String rotulo;

		StatusDoacao(String rotulo) {
			this.rotulo = rotulo;
		}

		@JsonValue
		public String rotulo() {
			return rotulo;
		}
	}

	public enum Alergenico {
		GLUTEN("Glúten"),
		LACTOSE("Lactose"),
		OVOS("Ovos"),
		AMENDOIM("Amendoim"),
		CASTANHAS("Castanhas"),
		SOJA("Soja"),
		FRUTOS_DO_MAR("Frutos do mar");

		private final String rotulo;

		Alergenico(String rotulo) {
			this.rotulo = rotulo;
		}

		@JsonValue
		public String rotulo() {
			return rotulo;
		}
	}
}
