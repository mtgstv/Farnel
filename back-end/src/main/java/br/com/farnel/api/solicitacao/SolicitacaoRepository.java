package br.com.farnel.api.solicitacao;

import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import br.com.farnel.api.solicitacao.OpcoesSolicitacao.StatusSolicitacao;

// As listas já trazem a doação de cada pedido (e os alergênicos dela) na mesma consulta
public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Long> {

	// Pedidos que a pessoa fez
	@EntityGraph(attributePaths = { "doacao", "doacao.alergenicos" })
	List<Solicitacao> findBySolicitanteIdOrderByCriadoEmDesc(Long solicitanteId);

	// Pedidos recebidos nas doações da pessoa (doacao.usuario.id = dono da doação)
	@EntityGraph(attributePaths = { "doacao", "doacao.alergenicos" })
	List<Solicitacao> findByDoacaoUsuarioIdOrderByCriadoEmDesc(Long donoId);

	List<Solicitacao> findByDoacaoIdAndStatusIn(Long doacaoId, Collection<StatusSolicitacao> status);

	boolean existsByDoacaoIdAndStatusIn(Long doacaoId, Collection<StatusSolicitacao> status);

	boolean existsByDoacaoIdAndSolicitanteIdAndStatusIn(Long doacaoId, Long solicitanteId,
			Collection<StatusSolicitacao> status);
}
