package br.com.farnel.api.usuario;

import java.time.Instant;
import java.util.List;

import br.com.farnel.api.doacao.OpcoesDoacao.Categoria;
import br.com.farnel.api.usuario.UsuarioDtos.Avisos;

// O que a API devolve sobre a conta logada: dados da conta + perfil (nunca o senha_hash).
// É a resposta do cadastro, do login, da renovação da sessão e de /me.
// criadoEm é o "membro desde".
public record UsuarioResponse(
		Long id,
		String nome,
		String email,
		Papel papel,
		Instant criadoEm,
		String telefone,
		PerfilUsuario perfil,
		String organizacao,
		String sobre,
		String cidade,
		String uf,
		String endereco,
		String horario,
		String foto,
		List<Categoria> interesses,
		Avisos avisos,
		// Instituição conferida pelo administrador
		boolean verificada) {

	public static UsuarioResponse de(Usuario usuario) {
		return new UsuarioResponse(
				usuario.getId(),
				usuario.getNome(),
				usuario.getEmail(),
				usuario.getPapel(),
				usuario.getCriadoEm(),
				usuario.getTelefone(),
				usuario.getPerfil(),
				usuario.getOrganizacao(),
				usuario.getSobre(),
				usuario.getCidade(),
				usuario.getUf(),
				usuario.getEndereco(),
				usuario.getHorario(),
				usuario.getFoto(),
				// Sempre na ordem da lista de categorias
				usuario.getInteresses().stream().sorted().toList(),
				new Avisos(usuario.isAvisoNovasDoacoes(), usuario.isAvisoPedidosRecebidos(),
						usuario.isAvisoLembretesValidade()),
				usuario.isVerificada());
	}
}
