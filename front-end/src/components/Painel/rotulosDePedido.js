// Nas telas de pedidos, "Concluída" aparece como "Entregue" (itens: [{ rotulo, total }])
export function rotulosDePedido(itens) {
    return itens.map((item) => (item.rotulo === "Concluída" ? { ...item, rotulo: "Entregue" } : item));
}
