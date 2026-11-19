package br.com.farnel.api.usuario;

import com.fasterxml.jackson.annotation.JsonValue;

// "Você participa como", no perfil: as mesmas opções do front-end (PERFIS_USUARIO em src/data/opcoesDoacao.js).
// No banco fica o nome do enum; no JSON vai e volta o texto da tela.
// As contas ONG_INSTITUICAO são as instituições (ONGs, cozinhas solidárias...).
public enum PerfilUsuario {
	PESSOA_FISICA("Pessoa física"),
	ESTABELECIMENTO_COMERCIAL("Estabelecimento comercial"),
	PRODUTOR_RURAL("Produtor rural"),
	ONG_INSTITUICAO("ONG ou instituição");

	private final String rotulo;

	PerfilUsuario(String rotulo) {
		this.rotulo = rotulo;
	}

	@JsonValue
	public String rotulo() {
		return rotulo;
	}
}
