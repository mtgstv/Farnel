package br.com.farnel.api.usuario;

import java.nio.charset.StandardCharsets;
import java.util.Locale;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.farnel.api.comum.CamposInvalidosException;
import br.com.farnel.api.comum.ErroApiException;
import br.com.farnel.api.usuario.UsuarioDtos.PerfilRequest;
import br.com.farnel.api.usuario.UsuarioDtos.TrocarSenhaRequest;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UsuarioService {

	// O BCrypt só aceita senhas de até 72 bytes (letras com acento ocupam 2)
	private static final int LIMITE_BYTES_SENHA = 72;

	private final UsuarioRepository usuarios;
	private final PasswordEncoder senhas;

	@Transactional(readOnly = true)
	public UsuarioResponse buscar(Long id) {
		return UsuarioResponse.de(encontrar(id));
	}

	@Transactional
	public UsuarioResponse atualizarPerfil(Long id, PerfilRequest dados) {
		Usuario usuario = encontrar(id);

		if (dados.perfil() != PerfilUsuario.PESSOA_FISICA
				&& (dados.organizacao() == null || dados.organizacao().isBlank())) {
			throw new CamposInvalidosException(
					Map.of("organizacao", "Informe o nome do estabelecimento ou da instituição."));
		}

		// Mesma padronização do cadastro: "Maria@Gmail.com" e "maria@gmail.com" são o mesmo e-mail
		String email = dados.email().trim().toLowerCase(Locale.ROOT);
		if (!email.equals(usuario.getEmail()) && usuarios.existsByEmail(email)) {
			throw new ErroApiException(HttpStatus.CONFLICT, "Este e-mail já está em uso por outra conta.");
		}

		// Sem save: dentro da transação, o JPA grava sozinho o que mudou
		usuario.atualizarPerfil(dados, email);
		return UsuarioResponse.de(usuario);
	}

	@Transactional
	public void trocarSenha(Long id, TrocarSenhaRequest dados) {
		Usuario usuario = encontrar(id);

		if (bytes(dados.senhaAtual()) > LIMITE_BYTES_SENHA || !senhas.matches(dados.senhaAtual(), usuario.getSenhaHash())) {
			throw new CamposInvalidosException(Map.of("senhaAtual", "Senha atual incorreta."));
		}
		if (bytes(dados.novaSenha()) > LIMITE_BYTES_SENHA) {
			throw new CamposInvalidosException(Map.of("novaSenha",
					"A nova senha é longa demais. Use até 72 caracteres (letras com acento contam como dois)."));
		}
		if (dados.novaSenha().equals(dados.senhaAtual())) {
			throw new CamposInvalidosException(Map.of("novaSenha", "A nova senha deve ser diferente da atual."));
		}

		usuario.trocarSenha(senhas.encode(dados.novaSenha()));
	}

	private Usuario encontrar(Long id) {
		// O token é válido, mas a conta não existe mais
		return usuarios.findById(id)
				.orElseThrow(() -> new ErroApiException(HttpStatus.UNAUTHORIZED, "Sessão inválida. Entre novamente."));
	}

	private static int bytes(String senha) {
		return senha.getBytes(StandardCharsets.UTF_8).length;
	}
}
