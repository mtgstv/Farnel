package br.com.farnel.api.painel;

import java.math.BigDecimal;
import java.util.List;

// O que o painel ("Meu painel") mostra. As listas já vêm com o texto da tela e na ordem certa para os gráficos.
public record PainelResponse(
		long totalDoacoes,
		// Todas as situações, mesmo as que estão com zero: Disponível, Solicitada, Vencida, Concluída, Cancelada
		List<Item> doacoesPorStatus,
		// Só as categorias que têm doação, da que tem mais para a que tem menos
		List<Item> doacoesPorCategoria,
		// Quanto já foi entregue, por unidade
		List<Quantidade> entregue,
		long pessoasAtendidas,
		List<Item> pedidosFeitos,
		List<Item> pedidosRecebidos,
		long favoritos) {

	public record Item(String rotulo, long total) {
	}

	public record Quantidade(String unidade, BigDecimal total) {
	}
}
