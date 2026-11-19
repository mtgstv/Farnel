package br.com.farnel.api.instituicao;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;

import br.com.farnel.api.usuario.Usuario;

// Instituições = contas com perfil ONG_INSTITUICAO. Cada linha já vem com quantas doações a instituição recebeu
// (pedidos dela que foram entregues), contadas com LEFT JOIN + COUNT ... FILTER.
public interface InstituicaoRepository extends Repository<Usuario, Long> {

	interface Linha {
		Long getId();

		String getNome();

		String getEmail();

		String getCidade();

		String getUf();

		String getSobre();

		String getFoto();

		Boolean getVerificada();

		Long getDoacoesRecebidas();
	}

	// Lista pública: só as verificadas, em ordem alfabética
	@Query(value = """
			SELECT u.id AS id, COALESCE(u.organizacao, u.nome) AS nome, u.email AS email, u.cidade AS cidade, u.uf AS uf,
			       u.sobre AS sobre, u.foto AS foto, u.verificada AS verificada,
			       COUNT(s.id) FILTER (WHERE s.status = 'CONCLUIDA') AS doacoesRecebidas
			FROM usuario u
			LEFT JOIN solicitacao s ON s.solicitante_id = u.id
			WHERE u.perfil = 'ONG_INSTITUICAO' AND u.verificada
			GROUP BY u.id
			ORDER BY nome
			""", nativeQuery = true)
	List<Linha> verificadas();

	// Área administrativa: todas, as que ainda esperam verificação primeiro
	@Query(value = """
			SELECT u.id AS id, COALESCE(u.organizacao, u.nome) AS nome, u.email AS email, u.cidade AS cidade, u.uf AS uf,
			       u.sobre AS sobre, u.foto AS foto, u.verificada AS verificada,
			       COUNT(s.id) FILTER (WHERE s.status = 'CONCLUIDA') AS doacoesRecebidas
			FROM usuario u
			LEFT JOIN solicitacao s ON s.solicitante_id = u.id
			WHERE u.perfil = 'ONG_INSTITUICAO'
			GROUP BY u.id
			ORDER BY u.verificada, nome
			""", nativeQuery = true)
	List<Linha> todas();
}
