package br.com.farnel.api.doacao;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import br.com.farnel.api.doacao.DoacaoDtos.DoacaoRequest;
import br.com.farnel.api.doacao.OpcoesDoacao.Alergenico;
import br.com.farnel.api.doacao.OpcoesDoacao.Categoria;
import br.com.farnel.api.doacao.OpcoesDoacao.Conservacao;
import br.com.farnel.api.doacao.OpcoesDoacao.StatusDoacao;
import br.com.farnel.api.doacao.OpcoesDoacao.TipoRetirada;
import br.com.farnel.api.usuario.Usuario;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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

// Uma doação de alimento (tabela "doacao", criada em db/migration/V2__doacoes.sql)
@Entity
@Table(name = "doacao")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Doacao {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	// Conta que cadastrou a doação. LAZY: o usuário só é buscado no banco se alguém precisar dos dados dele.
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "usuario_id")
	private Usuario usuario;

	private String titulo;

	@Enumerated(EnumType.STRING)
	private Categoria categoria;

	private String descricao;

	private BigDecimal quantidade;

	private String unidade;

	private LocalDate validade;

	@Enumerated(EnumType.STRING)
	private Conservacao conservacao;

	// Tabela doacao_alergenico: uma linha para cada alergênico da doação
	@ElementCollection
	@CollectionTable(name = "doacao_alergenico", joinColumns = @JoinColumn(name = "doacao_id"))
	@Column(name = "alergenico")
	@Enumerated(EnumType.STRING)
	private Set<Alergenico> alergenicos = new HashSet<>();

	private String cidade;

	private String uf;

	private String endereco;

	@Enumerated(EnumType.STRING)
	private TipoRetirada tipoRetirada;

	private String horario;

	private String observacoes;

	// Nome mostrado como doador: a pessoa ou o estabelecimento
	private String doador;

	// Telefone/WhatsApp do doador
	private String contato;

	// Endereço da foto (doações de exemplo) ou a própria foto em base64 (doações cadastradas no site)
	private String imagem;

	@Enumerated(EnumType.STRING)
	private StatusDoacao status = StatusDoacao.DISPONIVEL;

	private Instant criadoEm = Instant.now();

	public Doacao(Usuario usuario, DoacaoRequest dados) {
		this.usuario = usuario;
		this.titulo = dados.titulo().trim();
		this.categoria = dados.categoria();
		this.descricao = dados.descricao().trim();
		this.quantidade = dados.quantidade();
		this.unidade = dados.unidade().trim();
		this.validade = dados.validade();
		this.conservacao = dados.conservacao();
		if (dados.alergenicos() != null) {
			this.alergenicos.addAll(dados.alergenicos());
		}
		this.cidade = dados.cidade().trim();
		this.uf = dados.uf();
		this.endereco = textoOuNulo(dados.endereco());
		this.tipoRetirada = dados.tipoRetirada();
		this.horario = textoOuNulo(dados.horario());
		this.observacoes = textoOuNulo(dados.observacoes());
		this.doador = dados.doador().trim();
		this.contato = dados.contato().trim();
		this.imagem = dados.imagem();
	}

	// Vencer hoje ainda vale; vencida é a doação cuja validade já passou
	public boolean estaVencida() {
		return validade.isBefore(LocalDate.now());
	}

	// Entregue ou cancelada: não muda mais de status
	public boolean estaEncerrada() {
		return status == StatusDoacao.CONCLUIDA || status == StatusDoacao.CANCELADA;
	}

	public boolean pertenceA(Long usuarioId) {
		return usuario.getId().equals(usuarioId);
	}

	// Quem pode encerrar e para qual status são regras do DoacaoService
	public void encerrar(StatusDoacao novoStatus) {
		this.status = novoStatus;
	}

	// Status coerente com os pedidos: com algum pedido em aberto fica "Solicitada"; sem nenhum,
	// volta a "Disponível". Entregues e canceladas não mudam mais.
	public void atualizarPelosPedidos(boolean temPedidoEmAberto) {
		if (!estaEncerrada()) {
			this.status = temPedidoEmAberto ? StatusDoacao.SOLICITADA : StatusDoacao.DISPONIVEL;
		}
	}

	// Campo opcional deixado em branco vira nulo no banco
	private static String textoOuNulo(String texto) {
		return texto == null || texto.isBlank() ? null : texto.trim();
	}
}
