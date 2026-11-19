package br.com.farnel.api.comum;

import java.util.Map;

import com.fasterxml.jackson.annotation.JsonInclude;

// Formato de todo erro da API.
// "message" segue o nome usado pelo erro padrão do Spring, que o front-end vai ler.
// "campos" traz a mensagem de cada campo inválido de um formulário (ex.: { "email": "Informe um e-mail válido." }).
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ErroResponse(String message, Map<String, String> campos) {

	public static ErroResponse de(String message) {
		return new ErroResponse(message, null);
	}
}
