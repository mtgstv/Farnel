package br.com.farnel.api.favorito;

import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface FavoritoRepository extends JpaRepository<Favorito, Long> {

	// Já traz cada doação (e os alergênicos dela) na mesma consulta
	@EntityGraph(attributePaths = { "doacao", "doacao.alergenicos" })
	List<Favorito> findByUsuarioIdOrderByCriadoEmDesc(Long usuarioId);

	// SQL escrito à mão por causa do ON CONFLICT: favoritar duas vezes (ex.: clique duplo)
	// não dá erro nem duplica, o UNIQUE da tabela simplesmente ignora a segunda vez
	@Modifying
	@Query(value = """
			INSERT INTO favorito (usuario_id, doacao_id) VALUES (:usuarioId, :doacaoId)
			ON CONFLICT (usuario_id, doacao_id) DO NOTHING
			""", nativeQuery = true)
	void adicionar(Long usuarioId, Long doacaoId);

	@Modifying
	@Query("delete from Favorito f where f.usuario.id = :usuarioId and f.doacao.id = :doacaoId")
	void remover(Long usuarioId, Long doacaoId);
}
