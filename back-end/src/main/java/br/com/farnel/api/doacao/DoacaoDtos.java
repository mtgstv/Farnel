package br.com.farnel.api.doacao;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;

import br.com.farnel.api.comum.Formatos;
import br.com.farnel.api.doacao.OpcoesDoacao.Alergenico;
import br.com.farnel.api.doacao.OpcoesDoacao.Categoria;
import br.com.farnel.api.doacao.OpcoesDoacao.Conservacao;
import br.com.farnel.api.doacao.OpcoesDoacao.StatusDoacao;
import br.com.farnel.api.doacao.OpcoesDoacao.TipoRetirada;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

// Formatos do JSON das doações. Os nomes dos campos são os mesmos do formulário do front
// (pages/Doacoes/NovaDoacao.jsx), então cada erro de validação cai direto no campo certo da tela.
public final class DoacaoDtos {

	private DoacaoDtos() {
	}

	// Corpo do POST /doacoes, com as mesmas regras do front (components/NovaDoacao/validarDoacao.js).
	// O endereço só é obrigatório na retirada no local: essa regra depende de dois campos e fica no DoacaoService.
	public record DoacaoRequest(
			@NotBlank(message = "Dê um nome ao alimento (mínimo de 3 letras).")
			@Size(min = 3, max = 100, message = "Dê um nome ao alimento (entre 3 e 100 letras).")
			String titulo,

			@NotNull(message = "Escolha uma categoria.")
			Categoria categoria,

			@NotBlank(message = "Descreva o alimento (mínimo de 10 caracteres).")
			@Size(min = 10, max = 1000, message = "Descreva o alimento (entre 10 e 1000 caracteres).")
			String descricao,

			@NotNull(message = "Informe uma quantidade maior que zero.")
			@Positive(message = "Informe uma quantidade maior que zero.")
			@Digits(integer = 8, fraction = 2, message = "Use no máximo duas casas decimais na quantidade.")
			BigDecimal quantidade,

			@NotBlank(message = "Escolha a unidade.")
			@Size(max = 20, message = "A unidade pode ter até 20 caracteres.")
			String unidade,

			@NotNull(message = "Informe a data de validade.")
			@FutureOrPresent(message = "Não é possível doar alimentos vencidos.")
			LocalDate validade,

			@NotNull(message = "Informe como o alimento deve ser conservado.")
			Conservacao conservacao,

			// Pode vir vazio ou nem vir
			Set<Alergenico> alergenicos,

			@NotNull(message = "Escolha como será a retirada.")
			TipoRetirada tipoRetirada,

			@NotBlank(message = "Informe a cidade.")
			@Size(max = 100, message = "A cidade pode ter até 100 caracteres.")
			String cidade,

			@NotBlank(message = "Escolha o estado.")
			@Pattern(regexp = Formatos.UF, message = "Escolha o estado.")
			String uf,

			@Size(max = 200, message = "O endereço pode ter até 200 caracteres.")
			String endereco,

			@Size(max = 100, message = "O horário pode ter até 100 caracteres.")
			String horario,

			@Size(max = 500, message = "As observações podem ter até 500 caracteres.")
			String observacoes,

			@NotBlank(message = "Informe o nome do doador ou do estabelecimento.")
			@Size(max = 150, message = "O nome do doador pode ter até 150 caracteres.")
			String doador,

			// Telefone com DDD: 10 ou 11 números, com ou sem a máscara (11) 99999-9999
			@NotBlank(message = "Informe um telefone com DDD.")
			@Size(max = 20, message = "Informe um telefone com DDD.")
			@Pattern(regexp = Formatos.TELEFONE, message = "Informe um telefone com DDD.")
			String contato,

			// Foto opcional, já reduzida pelo front (services/imagem.js) e enviada como data URL em base64
			@Size(max = 2_000_000, message = "A foto é grande demais. Escolha outra imagem.")
			@Pattern(regexp = Formatos.FOTO, message = "Envie a foto em JPG, PNG ou WEBP.")
			String imagem) {
	}

	// Corpo do PATCH /doacoes/{id}/status: { "status": "Concluída" } (entregue) ou { "status": "Cancelada" }
	public record AlterarStatusRequest(
			@NotNull(message = "Informe o novo status.")
			StatusDoacao status) {
	}

	// O que a API devolve sobre uma doação
	public record DoacaoResponse(
			Long id,
			String titulo,
			Categoria categoria,
			String descricao,
			BigDecimal quantidade,
			String unidade,
			LocalDate validade,
			Conservacao conservacao,
			List<Alergenico> alergenicos,
			String cidade,
			String uf,
			String endereco,
			TipoRetirada tipoRetirada,
			String horario,
			String observacoes,
			String doador,
			// Nulo para visitantes: o telefone do doador só aparece para quem está logado
			String contato,
			String imagem,
			// Disponível, Solicitada, Concluída ou Cancelada; o front mostra "Vencida" quando a validade já passou
			StatusDoacao status,
			Instant criadoEm,
			// Conta que cadastrou a doação (o front compara com o usuário logado para saber se a doação é dele)
			Long usuarioId) {

		public static DoacaoResponse de(Doacao doacao, boolean mostrarContato) {
			return new DoacaoResponse(
					doacao.getId(),
					doacao.getTitulo(),
					doacao.getCategoria(),
					doacao.getDescricao(),
					doacao.getQuantidade(),
					doacao.getUnidade(),
					doacao.getValidade(),
					doacao.getConservacao(),
					// Sempre na ordem da lista (a mesma do formulário)
					doacao.getAlergenicos().stream().sorted().toList(),
					doacao.getCidade(),
					doacao.getUf(),
					doacao.getEndereco(),
					doacao.getTipoRetirada(),
					doacao.getHorario(),
					doacao.getObservacoes(),
					doacao.getDoador(),
					mostrarContato ? doacao.getContato() : null,
					doacao.getImagem(),
					doacao.getStatus(),
					doacao.getCriadoEm(),
					doacao.getUsuario().getId());
		}
	}
}
