import BarraFiltros from "../BarraFiltros";
import { CATEGORIAS, STATUS_DOACAO } from "../../data/opcoesDoacao";

const ORDENACOES = [
    { valor: "validade", rotulo: "Validade mais próxima" },
    { valor: "nome", rotulo: "Nome (A-Z)" },
    { valor: "recentes", rotulo: "Mais recentes" },
];

/*
 * Busca, categoria, status e ordenação das listas de doações.
 * - ordenacaoPadrao: ordenação usada ao limpar os filtros (cada página tem a sua)
 */
function FiltrosDoacoes({
    busca,
    setBusca,
    categoriaSelecionada,
    setCategoriaSelecionada,
    statusSelecionado,
    setStatusSelecionado,
    ordenacaoSelecionada,
    setOrdenacaoSelecionada,
    ordenacaoPadrao = "validade",
}) {
    const temFiltro =
        busca !== "" ||
        categoriaSelecionada !== "Todas" ||
        statusSelecionado !== "Todos" ||
        ordenacaoSelecionada !== ordenacaoPadrao;

    function limpar() {
        setBusca("");
        setCategoriaSelecionada("Todas");
        setStatusSelecionado("Todos");
        setOrdenacaoSelecionada(ordenacaoPadrao);
    }

    return (
        <BarraFiltros>
            <input
                type="search"
                placeholder="Buscar alimento..."
                aria-label="Buscar alimento"
                value={busca}
                onChange={(event) => setBusca(event.target.value)}
                className="campo-filtro"
            />

            <select
                aria-label="Categoria"
                value={categoriaSelecionada}
                onChange={(event) => setCategoriaSelecionada(event.target.value)}
                className="campo-filtro lg:w-auto"
            >
                <option value="Todas">Todas as categorias</option>
                {CATEGORIAS.map((categoria) => (
                    <option key={categoria} value={categoria}>{categoria}</option>
                ))}
            </select>

            <select
                aria-label="Status"
                value={statusSelecionado}
                onChange={(event) => setStatusSelecionado(event.target.value)}
                className="campo-filtro lg:w-auto"
            >
                <option value="Todos">Todos os status</option>
                {STATUS_DOACAO.map((status) => (
                    <option key={status} value={status}>{status}</option>
                ))}
            </select>

            <select
                aria-label="Ordenar por"
                value={ordenacaoSelecionada}
                onChange={(event) => setOrdenacaoSelecionada(event.target.value)}
                className="campo-filtro lg:w-auto"
            >
                {ORDENACOES.map(({ valor, rotulo }) => (
                    <option key={valor} value={valor}>{rotulo}</option>
                ))}
            </select>

            <button type="button" onClick={limpar} disabled={!temFiltro} className="btn-outline btn-sm lg:flex-none">
                Limpar filtros
            </button>
        </BarraFiltros>
    );
}

export default FiltrosDoacoes;
