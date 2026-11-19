package br.com.farnel.api.doacao;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

// O Spring Data cria as consultas a partir do nome dos métodos.
// @EntityGraph traz os alergênicos na mesma consulta (sem ele, seria uma consulta a mais para cada doação).
public interface DoacaoRepository extends JpaRepository<Doacao, Long> {

	@EntityGraph(attributePaths = "alergenicos")
	List<Doacao> findAllByOrderByIdAsc();

	@EntityGraph(attributePaths = "alergenicos")
	List<Doacao> findByUsuarioIdOrderByCriadoEmDesc(Long usuarioId);

	@EntityGraph(attributePaths = "alergenicos")
	Optional<Doacao> findComAlergenicosById(Long id);

	// Área administrativa: todas as doações, já com quem cadastrou cada uma
	@EntityGraph(attributePaths = { "alergenicos", "usuario" })
	List<Doacao> findAllByOrderByCriadoEmDesc();

	@EntityGraph(attributePaths = { "alergenicos", "usuario" })
	Optional<Doacao> findComDonoById(Long id);

	// Doações em que a pessoa tem um pedido aceito ou já entregue: o telefone do doador fica liberado para ela
	@Query(value = "SELECT doacao_id FROM solicitacao WHERE solicitante_id = :usuarioId AND status IN ('ACEITA', 'CONCLUIDA')",
			nativeQuery = true)
	Set<Long> idsComPedidoAceito(Long usuarioId);
}
