package br.com.farnel.api.comum;

import java.util.Map;

import lombok.Getter;

// Erro de validação que depende de mais de um campo (ex.: o endereço só é obrigatório na retirada no local).
// Sai no mesmo formato dos erros do @Valid: 400 com a mensagem de cada campo em "campos".
@Getter
public class CamposInvalidosException extends RuntimeException {

	private final Map<String, String> campos;

	public CamposInvalidosException(Map<String, String> campos) {
		super("Confira os campos destacados.");
		this.campos = campos;
	}
}
