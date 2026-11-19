package br.com.farnel.api;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.context.annotation.Bean;
import org.testcontainers.postgresql.PostgreSQLContainer;

// Os testes usam um Postgres próprio (no Docker), sem depender do banco instalado no computador.
// @ServiceConnection faz a API se conectar a ele no lugar do banco do .env.
@TestConfiguration(proxyBeanMethods = false)
public class TestcontainersConfig {

	@Bean
	@ServiceConnection
	PostgreSQLContainer postgres() {
		// Mesma versão do banco de desenvolvimento (docker-compose.yml)
		return new PostgreSQLContainer("postgres:18");
	}
}
