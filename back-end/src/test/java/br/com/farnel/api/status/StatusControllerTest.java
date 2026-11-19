package br.com.farnel.api.status;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;

import br.com.farnel.api.TesteDeIntegracao;

class StatusControllerTest extends TesteDeIntegracao {

	@Test
	void statusEhPublicoEConfirmaOBanco() throws Exception {
		mvc.perform(get("/status"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.api").value("online"))
				.andExpect(jsonPath("$.postgres").exists());
	}
}
