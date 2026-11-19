package br.com.farnel.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
// Liga as classes que leem as configurações "app.*" do application.properties (ex.: config/AuthProperties)
@ConfigurationPropertiesScan
public class FarnelApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(FarnelApiApplication.class, args);
	}

}
