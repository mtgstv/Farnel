package br.com.farnel.api.comum;

import org.springframework.http.HttpStatus;

// Atalho para o erro 404 (ex.: doação que não existe)
public class RecursoNaoEncontradoException extends ErroApiException {

	public RecursoNaoEncontradoException(String mensagem) {
		super(HttpStatus.NOT_FOUND, mensagem);
	}
}
