import { useState } from "react";
import { Link } from "react-router-dom";
import FaixaTopo from "../../components/Layout/FaixaTopo";
import FundoPagina from "../../components/Layout/FundoPagina";
import BarraFiltros from "../../components/Comuns/BarraFiltros";
import ContadorResultados from "../../components/Comuns/ContadorResultados";
import EstadoVazio from "../../components/Comuns/EstadoVazio";
import { Carregando, ErroAoCarregar } from "../../components/Comuns/EstadoRequisicao";
import FotoDoacao from "../../components/Doacoes/FotoDoacao";
import AvisoSoParaInstituicoes from "../../components/Instituicoes/AvisoSoParaInstituicoes";
import { useAuth } from "../../hooks/useAuth";
import { useCarregar } from "../../hooks/useCarregar";
import { ehInstituicao } from "../../services/instituicoesService";
import { listarSolicitacoesFeitas } from "../../services/solicitacoesService";
import { converterData } from "../../services/ordenacaoDoacoes";
import { CATEGORIAS } from "../../data/opcoesDoacao";

const ORDENACOES = {
    recentes: (a, b) => converterData(b.dataRetirada) - converterData(a.dataRetirada),
    antigas: (a, b) => converterData(a.dataRetirada) - converterData(b.dataRetirada),
};

// Doações recebidas: o histórico do que a instituição já recebeu (pedidos dela marcados como entregues), com filtros
function InstDoa() {
    const { usuario } = useAuth();
    const { dados, erro, recarregar } = useCarregar(listarSolicitacoesFeitas);
    const [busca, setBusca] = useState("");
    const [categoria, setCategoria] = useState("Todas");
    const [ordenacao, setOrdenacao] = useState("recentes");

    const recebidas = (dados ?? []).filter((pedido) => pedido.status === "Concluída");
    const termo = busca.trim().toLowerCase();
    const filtradas = recebidas
        .filter((pedido) =>
            (categoria === "Todas" || pedido.doacao.categoria === categoria) &&
            [pedido.doacaoTitulo, pedido.doadorNome, pedido.nome].some((texto) => texto.toLowerCase().includes(termo))
        )
        .sort(ORDENACOES[ordenacao]);

    // Quantas recebidas em cada categoria (os atalhos acima da lista)
    const porCategoria = CATEGORIAS
        .map((nome) => ({ nome, total: recebidas.filter((pedido) => pedido.doacao.categoria === nome).length }))
        .filter((item) => item.total > 0);

    return (
        <div className="min-h-screen">
            <FaixaTopo
                eyebrow="Área da instituição"
                titulo="Doações recebidas"
                descricao="Tudo o que a sua instituição já recebeu pelo Farnel."
            >
                {ehInstituicao(usuario) && (
                    <BarraFiltros>
                        <input
                            type="search"
                            placeholder="Buscar por alimento ou doador..."
                            aria-label="Buscar"
                            value={busca}
                            onChange={(event) => setBusca(event.target.value)}
                            className="campo-filtro"
                        />
                        <select
                            aria-label="Categoria"
                            value={categoria}
                            onChange={(event) => setCategoria(event.target.value)}
                            className="campo-filtro lg:w-auto"
                        >
                            <option value="Todas">Todas as categorias</option>
                            {CATEGORIAS.map((nome) => (
                                <option key={nome} value={nome}>{nome}</option>
                            ))}
                        </select>
                        <select
                            aria-label="Ordenar por"
                            value={ordenacao}
                            onChange={(event) => setOrdenacao(event.target.value)}
                            className="campo-filtro lg:w-auto"
                        >
                            <option value="recentes">Mais recentes</option>
                            <option value="antigas">Mais antigas</option>
                        </select>
                    </BarraFiltros>
                )}
            </FaixaTopo>

            <FundoPagina>
                <main className="container-largo py-10 md:py-14">
                    {!ehInstituicao(usuario) ? (
                        <AvisoSoParaInstituicoes />
                    ) : erro ? (
                        <ErroAoCarregar erro={erro} onTentarNovamente={recarregar} titulo="Não foi possível carregar as doações recebidas" />
                    ) : !dados ? (
                        <Carregando texto="Carregando as doações recebidas..." />
                    ) : recebidas.length === 0 ? (
                        <EstadoVazio
                            eyebrow="Nada recebido ainda"
                            titulo="Sua instituição ainda não recebeu doações"
                            texto="Quando um doador marcar um pedido seu como entregue, ele aparece aqui."
                            acao={<Link to="/doacoes" className="btn-primary">Ver doações disponíveis</Link>}
                        />
                    ) : (
                        <>
                            <div className="mb-6 flex flex-wrap gap-2">
                                {porCategoria.map(({ nome, total }) => (
                                    <button
                                        key={nome}
                                        type="button"
                                        onClick={() => setCategoria(categoria === nome ? "Todas" : nome)}
                                        aria-pressed={categoria === nome}
                                        className={`rounded-full px-4 py-1.5 text-sm font-semibold ring-1 transition ${categoria === nome
                                            ? "bg-forest text-cream ring-forest"
                                            : "bg-white text-forest-dark ring-forest/15 hover:ring-forest/40"
                                            }`}
                                    >
                                        {nome} · {total}
                                    </button>
                                ))}
                            </div>

                            <ContadorResultados quantidade={filtradas.length} total={recebidas.length} singular="doação" plural="doações" />

                            {filtradas.length === 0 ? (
                                <EstadoVazio simples titulo="Nenhuma doação encontrada" texto="Tente outra busca ou outra categoria." />
                            ) : (
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {filtradas.map((pedido) => (
                                        <article key={pedido.id} className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-forest/5">
                                            <FotoDoacao doacao={pedido.doacao} className="h-36 w-full" />
                                            <div className="flex flex-1 flex-col gap-1.5 p-5 text-sm">
                                                <p className="rotulo-categoria">{pedido.doacao.categoria}</p>
                                                <h2 className="text-lg font-semibold">{pedido.doacaoTitulo}</h2>
                                                <p><span className="font-semibold text-ink">Doador:</span> <span className="text-ink-soft">{pedido.doadorNome}</span></p>
                                                <p><span className="font-semibold text-ink">Quantidade:</span> <span className="text-ink-soft">{pedido.quantidade}</span></p>
                                                <p><span className="font-semibold text-ink">Recebida para:</span> <span className="text-ink-soft">{pedido.nome}</span></p>
                                                <p><span className="font-semibold text-ink">Retirada em:</span> <span className="text-ink-soft">{pedido.dataRetirada}</span></p>
                                                <Link to={`/detalhes/${pedido.doacaoId}`} className="btn-secundario btn-sm mt-auto self-start">
                                                    Ver doação
                                                </Link>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </main>
            </FundoPagina>
        </div>
    );
}

export default InstDoa;
