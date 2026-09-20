function FiltrosDoacoes({
    busca,
    setBusca,
    categoriaSelecionada,
    setCategoriaSelecionada,
    statusSelecionado,
    setStatusSelecionado,
    ordenacaoSelecionada,
    setOrdenacaoSelecionada
}){
    
    return(
        <div className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-card md:flex-row md:items-end">

            <input
                type="text"
                placeholder="Buscar alimento..."
                value={busca}
                onChange={(event) => setBusca(event.target.value)}
                 className="w-full rounded-xl border border-line bg-cream/30 px-4 py-3 text-sm text-ink outline-none transition focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 md:flex-1"
            />
            <select 
                value={categoriaSelecionada}
                onChange={(event)=> setCategoriaSelecionada(event.target.value)}
                className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 md:w-auto"
            >
                <option value="Todas">Todas as Categorias</option>
                <option value="Grãos">Grãos</option>
                <option value="Frutas">Frutas</option>
                <option value="Verduras">Verduras</option>
                <option value="Legumes">Legumes</option>
                <option value="Enlatados">Enlatados</option>
                <option value="Massas">Massas</option>
                <option value="Bebidas">Bebidas</option>
                <option value="Laticínios">Laticínios</option>
                <option value="Padaria">Padaria</option>
                <option value="Outros">Outros</option>
            </select>

            <select 
                value={statusSelecionado}
                onChange={(event) => setStatusSelecionado(event.target.value)}
                className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 md:w-auto"
    
            >
                <option value="Todos">Todos os status</option>
                <option value="Disponível">Disponível</option>
                <option value="Solicitada">Solicitada</option>
                <option value="Concluída">Concluída</option>
                <option value="Cancelada">Cancelada</option>
                
            </select>

            <select
                value={ordenacaoSelecionada}
                onChange={(event) => setOrdenacaoSelecionada(event.target.value)}
                className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 md:w-auto"
            >
                <option value="validade">Validade mais próxima</option>
                <option value="nome">Nome (A-Z)</option>
                <option value="recentes">Mais recentes</option>
            </select>

            <button
                type="button"
                onClick={() => {
                    setBusca("");
                    setCategoriaSelecionada("Todas");
                    setStatusSelecionado("Todos");
                    setOrdenacaoSelecionada("validade");
                }}
                className="w-full rounded-xl border-2 border-forest/15 bg-white px-5 py-3 text-sm font-semibold text-forest-dark transition hover:-translate-y-0.5 hover:border-forest/30 md:w-auto"
            >
                Limpar filtros
            </button>
        </div>
    )
}

export default FiltrosDoacoes;