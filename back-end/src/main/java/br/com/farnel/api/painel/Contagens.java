package br.com.farnel.api.painel;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import br.com.farnel.api.doacao.OpcoesDoacao.Categoria;
import br.com.farnel.api.doacao.OpcoesDoacao.StatusDoacao;
import br.com.farnel.api.painel.PainelRepository.Contagem;
import br.com.farnel.api.painel.PainelRepository.Soma;
import br.com.farnel.api.painel.PainelResponse.Item;
import br.com.farnel.api.painel.PainelResponse.Quantidade;
import br.com.farnel.api.solicitacao.OpcoesSolicitacao.StatusSolicitacao;

// Transforma o que as consultas de contagem devolvem (códigos do banco + totais) no formato dos gráficos:
// texto da tela, ordem fixa e zero para o que não tiver nenhum. Usado pelo "Meu painel" e pelo painel do administrador.
public final class Contagens {

	private Contagens() {
	}

	// Disponível, Solicitada, Vencida, Concluída, Cancelada (chaves: os códigos do banco, mais VENCIDA)
	public static List<Item> doacoesPorSituacao(List<Contagem> contagens) {
		Map<String, Long> porSituacao = mapa(contagens);
		List<Item> itens = new ArrayList<>();
		itens.add(item(StatusDoacao.DISPONIVEL.rotulo(), porSituacao.get(StatusDoacao.DISPONIVEL.name())));
		itens.add(item(StatusDoacao.SOLICITADA.rotulo(), porSituacao.get(StatusDoacao.SOLICITADA.name())));
		itens.add(item("Vencida", porSituacao.get("VENCIDA")));
		itens.add(item(StatusDoacao.CONCLUIDA.rotulo(), porSituacao.get(StatusDoacao.CONCLUIDA.name())));
		itens.add(item(StatusDoacao.CANCELADA.rotulo(), porSituacao.get(StatusDoacao.CANCELADA.name())));
		return itens;
	}

	// Só as categorias que têm doação, na ordem que a consulta devolveu (da que tem mais para a que tem menos)
	public static List<Item> doacoesPorCategoria(List<Contagem> contagens) {
		return contagens.stream()
				.map(contagem -> item(Categoria.valueOf(contagem.getChave()).rotulo(), contagem.getTotal()))
				.toList();
	}

	public static List<Quantidade> entreguePorUnidade(List<Soma> somas) {
		return somas.stream().map(soma -> new Quantidade(soma.getChave(), soma.getTotal())).toList();
	}

	// Pedidos: todos os status, na ordem do fluxo (Pendente → Aceita → Concluída; Recusada; Cancelada)
	public static List<Item> pedidosPorStatus(List<Contagem> contagens) {
		Map<String, Long> porStatus = mapa(contagens);
		List<Item> itens = new ArrayList<>();
		for (StatusSolicitacao status : StatusSolicitacao.values()) {
			itens.add(item(status.rotulo(), porStatus.get(status.name())));
		}
		return itens;
	}

	public static long soma(List<Contagem> contagens) {
		return contagens.stream().mapToLong(Contagem::getTotal).sum();
	}

	private static Map<String, Long> mapa(List<Contagem> contagens) {
		return contagens.stream().collect(Collectors.toMap(Contagem::getChave, Contagem::getTotal));
	}

	private static Item item(String rotulo, Long total) {
		return new Item(rotulo, total == null ? 0 : total);
	}
}
