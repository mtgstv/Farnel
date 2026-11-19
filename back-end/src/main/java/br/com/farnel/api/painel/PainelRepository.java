package br.com.farnel.api.painel;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;

import br.com.farnel.api.doacao.Doacao;

/*
 * Todas as contas do painel ("Meu painel"), feitas pelo próprio banco com SQL (COUNT, SUM e GROUP BY):
 * em vez de trazer todas as linhas para o Java e contar uma por uma, o PostgreSQL já devolve os totais.
 * Cada consulta devolve pares chave/total (ex.: DISPONIVEL → 3), lidos pelas interfaces abaixo.
 */
public interface PainelRepository extends Repository<Doacao, Long> {

	interface Contagem {
		String getChave();

		Long getTotal();
	}

	interface Soma {
		String getChave();

		BigDecimal getTotal();
	}

	// Minhas doações por situação. "Vencida" não é guardada: é a doação ainda ativa cuja validade já passou.
	// "hoje" vem do Java, para usar o mesmo dia (e o mesmo fuso) que o resto da API.
	@Query(value = """
			SELECT CASE WHEN status IN ('DISPONIVEL', 'SOLICITADA') AND validade < :hoje THEN 'VENCIDA' ELSE status END AS chave,
			       COUNT(*) AS total
			FROM doacao
			WHERE usuario_id = :usuarioId
			GROUP BY 1
			""", nativeQuery = true)
	List<Contagem> doacoesPorSituacao(Long usuarioId, LocalDate hoje);

	@Query(value = """
			SELECT categoria AS chave, COUNT(*) AS total
			FROM doacao
			WHERE usuario_id = :usuarioId
			GROUP BY categoria
			ORDER BY total DESC, categoria
			""", nativeQuery = true)
	List<Contagem> doacoesPorCategoria(Long usuarioId);

	// Quanto já foi entregue (doações concluídas), somado por unidade: "150 kg", "40 pacotes"...
	@Query(value = """
			SELECT unidade AS chave, SUM(quantidade) AS total
			FROM doacao
			WHERE usuario_id = :usuarioId AND status = 'CONCLUIDA'
			GROUP BY unidade
			ORDER BY total DESC
			""", nativeQuery = true)
	List<Soma> entreguePorUnidade(Long usuarioId);

	@Query(value = """
			SELECT status AS chave, COUNT(*) AS total
			FROM solicitacao
			WHERE solicitante_id = :usuarioId
			GROUP BY status
			""", nativeQuery = true)
	List<Contagem> pedidosFeitosPorStatus(Long usuarioId);

	// Pedidos recebidos: os feitos nas doações da pessoa (JOIN com a tabela de doações)
	@Query(value = """
			SELECT s.status AS chave, COUNT(*) AS total
			FROM solicitacao s
			JOIN doacao d ON d.id = s.doacao_id
			WHERE d.usuario_id = :usuarioId
			GROUP BY s.status
			""", nativeQuery = true)
	List<Contagem> pedidosRecebidosPorStatus(Long usuarioId);

	// Quantas pessoas ou instituições diferentes já receberam doações da pessoa
	@Query(value = """
			SELECT COUNT(DISTINCT s.solicitante_id)
			FROM solicitacao s
			JOIN doacao d ON d.id = s.doacao_id
			WHERE d.usuario_id = :usuarioId AND s.status = 'CONCLUIDA'
			""", nativeQuery = true)
	long pessoasAtendidas(Long usuarioId);

	@Query(value = "SELECT COUNT(*) FROM favorito WHERE usuario_id = :usuarioId", nativeQuery = true)
	long favoritos(Long usuarioId);
}
