package br.com.farnel.api.usuario;

import java.util.Set;

import br.com.farnel.api.comum.Formatos;
import br.com.farnel.api.doacao.OpcoesDoacao.Categoria;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

// Corpos das rotas do perfil. Os nomes dos campos são os mesmos do formulário de "Meu perfil".
public final class UsuarioDtos {

	private UsuarioDtos() {
	}

	// Quais avisos a pessoa quer receber
	public record Avisos(boolean novasDoacoes, boolean pedidosRecebidos, boolean lembretesValidade) {
	}

	// Corpo do PUT /me. Telefone, cidade, UF, endereço etc. são opcionais (podem vir vazios).
	public record PerfilRequest(
			@NotBlank(message = "Informe seu nome.")
			@Size(min = 2, max = 150, message = "Informe seu nome.")
			String nome,

			@NotBlank(message = "Digite um e-mail válido.")
			@Email(message = "Digite um e-mail válido.")
			@Size(max = 255, message = "O e-mail pode ter até 255 caracteres.")
			String email,

			@Size(max = 20, message = "Informe o telefone com DDD.")
			@Pattern(regexp = "(" + Formatos.TELEFONE + ")?", message = "Informe o telefone com DDD.")
			String telefone,

			@NotNull(message = "Escolha como você participa.")
			PerfilUsuario perfil,

			// Obrigatório para quem não é pessoa física (regra no UsuarioService)
			@Size(max = 150, message = "O nome pode ter até 150 caracteres.")
			String organizacao,

			@Size(max = 300, message = "Use até 300 caracteres.")
			String sobre,

			@Size(max = 100, message = "A cidade pode ter até 100 caracteres.")
			String cidade,

			@Pattern(regexp = "(" + Formatos.UF + ")?", message = "Escolha o estado.")
			String uf,

			@Size(max = 200, message = "O endereço pode ter até 200 caracteres.")
			String endereco,

			@Size(max = 100, message = "O horário pode ter até 100 caracteres.")
			String horario,

			// Foto de perfil já reduzida pelo front (320 px), ou nulo para tirar a foto
			@Size(max = 700_000, message = "A foto é grande demais. Escolha outra imagem.")
			@Pattern(regexp = Formatos.FOTO, message = "Envie a foto em JPG, PNG ou WEBP.")
			String foto,

			Set<Categoria> interesses,

			Avisos avisos) {
	}

	// Corpo do PATCH /me/senha
	public record TrocarSenhaRequest(
			@NotBlank(message = "Informe a senha atual.")
			String senhaAtual,

			@NotBlank(message = "Crie a nova senha.")
			@Size(min = 8, max = 72, message = "A nova senha deve ter entre 8 e 72 caracteres.")
			String novaSenha) {
	}
}
