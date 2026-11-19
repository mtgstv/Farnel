package br.com.farnel.api.admin;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;

import br.com.farnel.api.doacao.Doacao;
import br.com.farnel.api.painel.PainelRepository.Contagem;
import br.com.farnel.api.painel.PainelRepository.Soma;

// As contas do painel administrativo: as mesmas do "Meu painel", mas do site inteiro (sem filtrar por usuário)
public interface AdminRepository extends Repository<Doacao, Long> {

	interface ContagemPorConta {
		Long getId();

		Long getTotal();
	}

	@Query(value = """
			SELECT CASE WHEN status IN ('DISPONIVEL', 'SOLICITADA') AND validade < :hoje THEN 'VENCIDA' ELSE status END AS chave,
			       COUNT(*) AS total
			FROM doacao
			GROUP BY 1
			""", nativeQuery = true)
	List<Contagem> doacoesPorSituacao(LocalDate hoje);

	@Query(value = """
			SELECT categoria AS chave, COUNT(*) AS total
			FROM doacao
			GROUP BY categoria
			ORDER BY total DESC, categoria
			""", nativeQuery = true)
	List<Contagem> doacoesPorCategoria();

	@Query(value = """
			SELECT unidade AS chave, SUM(quantidade) AS total
			FROM doacao
			WHERE status = 'CONCLUIDA'
			GROUP BY unidade
			ORDER BY total DESC
			""", nativeQuery = true)
	List<Soma> entreguePorUnidade();

	@Query(value = "SELECT status AS chave, COUNT(*) AS total FROM solicitacao GROUP BY status", nativeQuery = true)
	List<Contagem> pedidosPorStatus();

	// Contas por papel (USUARIO, ADMIN)
	@Query(value = "SELECT papel AS chave, COUNT(*) AS total FROM usuario GROUP BY papel", nativeQuery = true)
	List<Contagem> contasPorPapel();

	@Query(value = "SELECT COUNT(*) FROM usuario WHERE perfil = 'ONG_INSTITUICAO'", nativeQuery = true)
	long instituicoes();

	// Contas que já cadastraram pelo menos uma doação
	@Query(value = "SELECT COUNT(DISTINCT usuario_id) FROM doacao", nativeQuery = true)
	long doadores();

	// Pessoas ou instituições diferentes que já receberam alguma doação
	@Query(value = "SELECT COUNT(DISTINCT solicitante_id) FROM solicitacao WHERE status = 'CONCLUIDA'", nativeQuery = true)
	long pessoasAtendidas();

	// Para a tabela de usuários: quantas doações e quantos pedidos cada conta tem
	@Query(value = "SELECT usuario_id AS id, COUNT(*) AS total FROM doacao GROUP BY usuario_id", nativeQuery = true)
	List<ContagemPorConta> doacoesPorConta();

	@Query(value = "SELECT solicitante_id AS id, COUNT(*) AS total FROM solicitacao GROUP BY solicitante_id", nativeQuery = true)
	List<ContagemPorConta> pedidosPorConta();
}
