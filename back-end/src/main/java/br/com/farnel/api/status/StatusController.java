package br.com.farnel.api.status;

import java.util.Map;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

// GET /api/v1/status (público): diz se a API está no ar e confirma a conexão com o banco,
// consultando o nome do banco e a versão do PostgreSQL. O front-end pode usar para saber
// se o servidor caiu e mostrar os dados de contingência.
@RestController
@RequestMapping("/status")
@RequiredArgsConstructor
public class StatusController {

	private final JdbcTemplate jdbcTemplate;

	@GetMapping
	public Map<String, Object> status() {
		Map<String, Object> banco = jdbcTemplate.queryForMap(
				"select current_database() as nome, current_setting('server_version') as versao");

		return Map.of(
				"api", "online",
				"banco", banco.get("nome"),
				"postgres", banco.get("versao"));
	}
}
