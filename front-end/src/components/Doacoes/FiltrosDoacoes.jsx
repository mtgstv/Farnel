function FiltrosDoacoes({
    categoriaSelecionada,
    setCategoriaSelecionada,
    statusSelecionado,
    setStatusSelecionado,
    ordenacaoSelecionada,
    setOrdenacaoSelecionada
}){
    
    return(
        <div>
            <select 
                value={categoriaSelecionada}
                onChange={(event)=> setCategoriaSelecionada(event.target.value)}
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
            >
                <option value="validade">Validade mais próxima</option>
                <option value="nome">Nome (A-Z)</option>
                <option value="recentes">Mais recentes</option>
            </select>

            <button>Limpar filtros</button>
        </div>
    )
}

export default FiltrosDoacoes;