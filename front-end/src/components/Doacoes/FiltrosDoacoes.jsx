function FiltrosDoacoes({
    categoriaSelecionada,
    setCategoriaSelecionada,
    statusSelecionado,
    setStatusSelecionado
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

            <select>
                <option>Validade mais próxima</option>
                <option>Nome (A-Z)</option>
                <option>Mais recentes</option>
            </select>

            <button>Limpar filtros</button>
        </div>
    )
}

export default FiltrosDoacoes;