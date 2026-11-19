package br.com.farnel.api.comum;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

// Transforma as exceções lançadas nos controllers e services em respostas JSON no formato ErroResponse
@RestControllerAdvice
public class TratadorDeErros {

	@ExceptionHandler(ErroApiException.class)
	public ResponseEntity<ErroResponse> erroDaApi(ErroApiException erro) {
		return ResponseEntity.status(erro.getStatus()).body(ErroResponse.de(erro.getMessage()));
	}

	// @Valid falhou: devolve a primeira mensagem de cada campo para o formulário mostrar
	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ErroResponse> dadosInvalidos(MethodArgumentNotValidException erro) {
		Map<String, String> campos = new LinkedHashMap<>();
		for (FieldError campo : erro.getBindingResult().getFieldErrors()) {
			campos.putIfAbsent(campo.getField(), campo.getDefaultMessage());
		}

		return ResponseEntity.badRequest().body(new ErroResponse("Confira os campos destacados.", campos));
	}

	@ExceptionHandler(CamposInvalidosException.class)
	public ResponseEntity<ErroResponse> camposInvalidos(CamposInvalidosException erro) {
		return ResponseEntity.badRequest().body(new ErroResponse(erro.getMessage(), erro.getCampos()));
	}

	// Parâmetro da URL com o tipo errado, ex.: /doacoes/abc (o id precisa ser um número)
	@ExceptionHandler(MethodArgumentTypeMismatchException.class)
	public ResponseEntity<ErroResponse> parametroInvalido() {
		return ResponseEntity.badRequest().body(ErroResponse.de("Endereço inválido: confira o número no fim da URL."));
	}

	// JSON malformado ou com uma opção que não existe (ex.: categoria "Doces")
	@ExceptionHandler(HttpMessageNotReadableException.class)
	public ResponseEntity<ErroResponse> corpoIlegivel() {
		return ResponseEntity.status(HttpStatus.BAD_REQUEST)
				.body(ErroResponse.de("Não foi possível ler os dados enviados."));
	}

	// Regra do banco (UNIQUE, CHECK...) barrou a gravação, ex.: dois cadastros com o mesmo e-mail ao mesmo tempo
	@ExceptionHandler(DataIntegrityViolationException.class)
	public ResponseEntity<ErroResponse> conflitoNoBanco() {
		return ResponseEntity.status(HttpStatus.CONFLICT)
				.body(ErroResponse.de("Não foi possível salvar: algum dado repete outro já cadastrado. Confira e tente de novo."));
	}
}
