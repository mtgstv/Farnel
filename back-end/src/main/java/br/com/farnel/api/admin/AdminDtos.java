package br.com.farnel.api.admin;

import java.time.Instant;
import java.util.List;

import br.com.farnel.api.doacao.Doacao;
import br.com.farnel.api.doacao.DoacaoDtos.DoacaoResponse;
import br.com.farnel.api.painel.PainelResponse.Item;
import br.com.farnel.api.painel.PainelResponse.Quantidade;
import br.com.farnel.api.usuario.Papel;
import br.com.farnel.api.usuario.PerfilUsuario;
import br.com.farnel.api.usuario.Usuario;

import jakarta.validation.constraints.NotNull;

// Formatos do JSON da área administrativa (/admin)
public final class AdminDtos {

	private AdminDtos() {
	}

	// Os números do site inteiro (página "Painel administrativo")
	public record PainelGeralResponse(
			long contas,
			long administradores,
			long instituicoes,
			long doadores,
			long totalDoacoes,
			List<Item> doacoesPorStatus,
			List<Item> doacoesPorCategoria,
			List<Quantidade> entregue,
			long totalPedidos,
			List<Item> pedidosPorStatus,
			long pessoasAtendidas) {
	}

	// Quem cadastrou a doação (a tabela de doações mostra)
	public record Dono(Long id, String nome, String email) {
	}

	// Uma linha de "Gerenciar doações": a doação (com o telefone, que o administrador sempre vê) e o dono
	public record DoacaoAdminResponse(DoacaoResponse doacao, Dono dono) {

		public static DoacaoAdminResponse de(Doacao doacao) {
			Usuario dono = doacao.getUsuario();
			return new DoacaoAdminResponse(DoacaoResponse.de(doacao, true),
					new Dono(dono.getId(), dono.getNome(), dono.getEmail()));
		}
	}

	// Uma linha de "Gerenciar usuários" (sem o senha_hash)
	public record UsuarioAdminResponse(
			Long id,
			String nome,
			String email,
			Papel papel,
			PerfilUsuario perfil,
			String organizacao,
			String cidade,
			String uf,
			Instant criadoEm,
			long doacoes,
			long pedidos) {

		public static UsuarioAdminResponse de(Usuario usuario, long doacoes, long pedidos) {
			return new UsuarioAdminResponse(usuario.getId(), usuario.getNome(), usuario.getEmail(), usuario.getPapel(),
					usuario.getPerfil(), usuario.getOrganizacao(), usuario.getCidade(), usuario.getUf(),
					usuario.getCriadoEm(), doacoes, pedidos);
		}
	}

	// Corpo do PATCH /admin/usuarios/{id}/papel: { "papel": "ADMIN" } ou { "papel": "USUARIO" }
	public record AlterarPapelRequest(
			@NotNull(message = "Escolha o papel.")
			Papel papel) {
	}
}
