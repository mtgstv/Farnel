package br.com.farnel.api.favorito;

import java.time.Instant;

import br.com.farnel.api.doacao.Doacao;
import br.com.farnel.api.usuario.Usuario;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

// Uma doação na lista de favoritos de um usuário (tabela "favorito", criada em V3__favoritos.sql).
// Não tem construtor público: os favoritos são gravados pelo FavoritoRepository.adicionar.
@Entity
@Table(name = "favorito")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Favorito {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "usuario_id")
	private Usuario usuario;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "doacao_id")
	private Doacao doacao;

	private Instant criadoEm;
}
