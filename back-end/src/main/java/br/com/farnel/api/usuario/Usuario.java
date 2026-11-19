package br.com.farnel.api.usuario;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

import br.com.farnel.api.doacao.OpcoesDoacao.Categoria;
import br.com.farnel.api.usuario.UsuarioDtos.Avisos;
import br.com.farnel.api.usuario.UsuarioDtos.PerfilRequest;

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
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

// Uma conta do Farnel (tabela "usuario", criada na V1; os dados do perfil vieram na V5)
@Entity
@Table(name = "usuario")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Usuario {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String nome;

	private String email;

	// Hash BCrypt; a senha pura nunca é guardada
	private String senhaHash;

	@Enumerated(EnumType.STRING)
	private Papel papel = Papel.USUARIO;

	private Instant criadoEm = Instant.now();

	// ---------- Perfil ----------

	private String telefone;

	@Enumerated(EnumType.STRING)
	private PerfilUsuario perfil = PerfilUsuario.PESSOA_FISICA;

	// Nome do estabelecimento ou da instituição (quem não é pessoa física)
	private String organizacao;

	private String sobre;

	private String cidade;

	private String uf;

	private String endereco;

	private String horario;

	private String foto;

	// Tabela usuario_interesse. EAGER: vem junto sempre que a conta é buscada (são poucas linhas),
	// porque a resposta de login, de /me e do perfil sempre mostra os interesses.
	@ElementCollection(fetch = FetchType.EAGER)
	@CollectionTable(name = "usuario_interesse", joinColumns = @JoinColumn(name = "usuario_id"))
	@Column(name = "categoria")
	@Enumerated(EnumType.STRING)
	private Set<Categoria> interesses = new HashSet<>();

	private boolean avisoNovasDoacoes = true;

	private boolean avisoPedidosRecebidos = true;

	private boolean avisoLembretesValidade = true;

	// Instituição conferida pelo administrador (só vale para quem participa como ONG ou instituição)
	private boolean verificada;

	public Usuario(String nome, String email, String senhaHash) {
		this.nome = nome;
		this.email = email;
		this.senhaHash = senhaHash;
	}

	// O e-mail chega já padronizado (minúsculas, sem espaços) pelo UsuarioService
	public void atualizarPerfil(PerfilRequest dados, String emailPadronizado) {
		this.nome = dados.nome().trim();
		this.email = emailPadronizado;
		this.telefone = textoOuNulo(dados.telefone());
		this.perfil = dados.perfil();
		// Pessoa física não tem nome de estabelecimento
		this.organizacao = dados.perfil() == PerfilUsuario.PESSOA_FISICA ? null : textoOuNulo(dados.organizacao());
		// Quem deixa de ser instituição perde a verificação (se voltar a ser, o administrador confere de novo)
		if (!ehInstituicao()) {
			this.verificada = false;
		}
		this.sobre = textoOuNulo(dados.sobre());
		this.cidade = textoOuNulo(dados.cidade());
		this.uf = textoOuNulo(dados.uf());
		this.endereco = textoOuNulo(dados.endereco());
		this.horario = textoOuNulo(dados.horario());
		this.foto = dados.foto();

		this.interesses.clear();
		if (dados.interesses() != null) {
			this.interesses.addAll(dados.interesses());
		}

		Avisos avisos = dados.avisos() == null ? new Avisos(true, true, true) : dados.avisos();
		this.avisoNovasDoacoes = avisos.novasDoacoes();
		this.avisoPedidosRecebidos = avisos.pedidosRecebidos();
		this.avisoLembretesValidade = avisos.lembretesValidade();
	}

	public void trocarSenha(String novoHash) {
		this.senhaHash = novoHash;
	}

	// Só o administrador muda o papel de alguém (ver admin/AdminService)
	public void mudarPapel(Papel novoPapel) {
		this.papel = novoPapel;
	}

	public boolean ehInstituicao() {
		return perfil == PerfilUsuario.ONG_INSTITUICAO;
	}

	// Só o administrador verifica uma instituição (ver instituicao/InstituicaoService)
	public void marcarVerificada(boolean verificada) {
		this.verificada = verificada;
	}

	private static String textoOuNulo(String texto) {
		return texto == null || texto.isBlank() ? null : texto.trim();
	}
}
