package br.com.farnel.api.solicitacao;

import java.time.Instant;
import java.time.LocalDate;

import br.com.farnel.api.doacao.Doacao;
import br.com.farnel.api.solicitacao.OpcoesSolicitacao.FormaRecebimento;
import br.com.farnel.api.solicitacao.OpcoesSolicitacao.StatusSolicitacao;
import br.com.farnel.api.solicitacao.OpcoesSolicitacao.TipoSolicitante;
import br.com.farnel.api.solicitacao.SolicitacaoDtos.SolicitacaoRequest;
import br.com.farnel.api.usuario.Usuario;

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

// Um pedido de doação (tabela "solicitacao", criada em db/migration/V4__solicitacoes.sql)
@Entity
@Table(name = "solicitacao")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Solicitacao {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "doacao_id")
	private Doacao doacao;

	// Conta que fez o pedido
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "solicitante_id")
	private Usuario solicitante;

	@Enumerated(EnumType.STRING)
	private TipoSolicitante tipoSolicitante;

	private String nome;

	private String contato;

	private String quantidade;

	private LocalDate dataRetirada;

	private String horario;

	@Enumerated(EnumType.STRING)
	private FormaRecebimento forma;

	private String mensagem;

	@Enumerated(EnumType.STRING)
	private StatusSolicitacao status = StatusSolicitacao.PENDENTE;

	private Instant criadoEm = Instant.now();

	private Instant atualizadoEm = Instant.now();

	public Solicitacao(Doacao doacao, Usuario solicitante, SolicitacaoRequest dados) {
		this.doacao = doacao;
		this.solicitante = solicitante;
		this.tipoSolicitante = dados.tipoSolicitante();
		this.nome = dados.nome().trim();
		this.contato = dados.contato().trim();
		this.quantidade = dados.quantidade().trim();
		this.dataRetirada = dados.dataRetirada();
		this.horario = textoOuNulo(dados.horario());
		this.forma = dados.forma();
		this.mensagem = textoOuNulo(dados.mensagem());
	}

	// Pendente ou aceito: o pedido ainda "segura" a doação para quem pediu
	public boolean estaAberta() {
		return status == StatusSolicitacao.PENDENTE || status == StatusSolicitacao.ACEITA;
	}

	public boolean feitaPor(Long usuarioId) {
		return solicitante.getId().equals(usuarioId);
	}

	// Depois que o doador aceita, quem pediu recebe o telefone dele para combinar a retirada
	public boolean liberaContatoDoDoador() {
		return status == StatusSolicitacao.ACEITA || status == StatusSolicitacao.CONCLUIDA;
	}

	// Quem pode mudar para qual status são regras do SolicitacaoService
	public void mudarStatus(StatusSolicitacao novoStatus) {
		this.status = novoStatus;
		this.atualizadoEm = Instant.now();
	}

	private static String textoOuNulo(String texto) {
		return texto == null || texto.isBlank() ? null : texto.trim();
	}
}
