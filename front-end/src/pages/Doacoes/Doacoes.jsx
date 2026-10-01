import { useState } from "react";
import DoacaoCard from "../../components/Doacoes/DoacaoCard";
import FiltrosDoacoes from "../../components/Doacoes/FiltrosDoacoes";
import ContadorResultados from "../../components/Comuns/ContadorResultados";
import EstadoVazio from "../../components/Comuns/EstadoVazio";
import FaixaTopo from "../../components/Layout/FaixaTopo";
import FundoPagina from "../../components/Layout/FundoPagina";
import EsteiraDoacoes from "../../components/Doacoes/EsteiraDoacoes";
import CartaoCompacto from "../../components/Doacoes/CartaoCompacto";
import CartaoComBalao from "../../components/Doacoes/CartaoComBalao";
import { getDoacoes } from "../../services/doacoesStorage";
import { doacoesQueVencemPrimeiro, ordenarDoacoes, statusDaDoacao } from "../../services/ordenacaoDoacoes";
import { CATEGORIAS } from "../../data/opcoesDoacao";
import ModalDoacao from "../../components/Doacoes/ModalDoacao";
import { Link } from "react-router-dom";

/*
 * Toda a página usa o mesmo "container-largo": faixa de filtros, destaque, categorias e
 * fileiras ficam alinhados, com a mesma borda vazia à esquerda e à direita.
 */

// "Laticínios" → "laticinios", para usar no id da seção (link #categoria-laticinios).
// normalize("NFD") separa os acentos das letras, e o replace remove esses acentos.
function paraId(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function GradeDoacoes({ doacoes, onVerDetalhes }) {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {doacoes.map((doacao) => (
                <DoacaoCard
                    key={doacao.id}
                    doacao={doacao}
                    onVerDetalhes={onVerDetalhes}
                />
            ))}
        </div>
    );
}

// Seção do topo (sem filtros): as doações que vencem primeiro, com foto em destaque e balão.
function SecaoVencemPrimeiro({ doacoes, onVerDetalhes }) {
    const vencemPrimeiro = doacoesQueVencemPrimeiro(doacoes, 8);
    if (vencemPrimeiro.length === 0) return null;

    return (
        <section className="container-largo pt-12 md:pt-14">
            <p className="eyebrow">Fique de olho no prazo</p>
            <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Estas doações vencem primeiro</h2>

            <div className="mt-3">
                <EsteiraDoacoes
                    doacoes={vencemPrimeiro}
                    rotulo="Vencem primeiro"
                    classeCard="h-[21rem] w-80"
                    classeFaixa="h-[23.5rem]"
                    renderCartao={(doacao) => <CartaoComBalao doacao={doacao} onVerDetalhes={onVerDetalhes} />}
                />
            </div>
        </section>
    );
}

// Faixa verde com o total e os atalhos para cada categoria.
function AtalhosCategorias({ total, secoes }) {
    return (
        <nav aria-label="Categorias" className="container-largo">
            <div className="relative overflow-hidden rounded-3xl bg-forest px-6 py-5 md:px-8">
                <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-16 h-40 w-40 rounded-full border-2 border-cream/10" />

                <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
                    <p className="flex-none text-sm text-cream/80">
                        <span className="font-heading text-2xl font-semibold text-cream">{total}</span> doações em{" "}
                        <span className="font-semibold text-cream">{secoes.length} categorias</span>
                    </p>

                    <div className="flex flex-wrap gap-2">
                        {secoes.map(({ categoria, doacoes: daCategoria }) => (
                            <Link
                                key={categoria}
                                to={`#categoria-${paraId(categoria)}`}
                                className="inline-flex items-center gap-2 rounded-full bg-white/10 py-1.5 pl-3.5 pr-1.5 text-sm font-semibold text-cream ring-1 ring-white/20 transition hover:-translate-y-0.5 hover:bg-white hover:text-forest-dark"
                            >
                                {categoria}
                                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-terracotta px-1.5 text-[11px] font-bold text-white">
                                    {daCategoria.length}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
}

// Sem filtros: uma seção por categoria, cada uma com uma fileira de cards compactos.
function SecoesPorCategoria({ doacoes, onVerDetalhes }) {
    const secoes = CATEGORIAS
        .map((categoria) => ({
            categoria,
            doacoes: doacoes.filter((doacao) => doacao.categoria === categoria),
        }))
        .filter((secao) => secao.doacoes.length > 0);

    return (
        <>
            <AtalhosCategorias total={doacoes.length} secoes={secoes} />

            <div className="container-largo mt-8 flex flex-col gap-4">
                {secoes.map(({ categoria, doacoes: daCategoria }) => (
                    <section key={categoria} id={`categoria-${paraId(categoria)}`} className="scroll-mt-24">
                        <div className="flex items-baseline gap-3">
                            <h2 className="text-xl font-semibold sm:text-2xl">{categoria}</h2>
                            <span className="text-sm text-ink-soft">
                                {daCategoria.length} {daCategoria.length === 1 ? "doação" : "doações"}
                            </span>
                        </div>

                        <EsteiraDoacoes
                            doacoes={daCategoria}
                            rotulo={categoria}
                            classeCard="h-[18.5rem] w-64"
                            classeFaixa="h-[21rem]"
                            renderCartao={(doacao) => <CartaoCompacto doacao={doacao} onVerDetalhes={onVerDetalhes} />}
                        />
                    </section>
                ))}
            </div>
        </>
    );
}

function Doacoes() {
    const [doacoes] = useState(getDoacoes());

    const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todas");
    const [statusSelecionado, setStatusSelecionado] = useState("Todos");
    const [ordenacaoSelecionada, setOrdenacaoSelecionada] = useState("validade");
    const [busca, setBusca] = useState("");
    const [doacaoSelecionada, setDoacaoSelecionada] = useState(null);

    const doacoesFiltradas = doacoes.filter((doacao) => {
        const categoriaCorresponde =
            categoriaSelecionada === "Todas" ||
            doacao.categoria === categoriaSelecionada;

        const statusCorresponde =
            statusSelecionado === "Todos" ||
            statusDaDoacao(doacao) === statusSelecionado;

        const buscaCorresponde =
            doacao.titulo.toLowerCase().includes(busca.toLowerCase());

        return categoriaCorresponde && statusCorresponde && buscaCorresponde;
    });

    const doacoesOrdenadas = ordenarDoacoes(doacoesFiltradas, ordenacaoSelecionada);

    // Com algum filtro ativo, volta para a lista única; a ordenação vale nos dois modos.
    const filtrando =
        busca.trim() !== "" ||
        categoriaSelecionada !== "Todas" ||
        statusSelecionado !== "Todos";

    const abrirDetalhes = (doacao) => {
        setDoacaoSelecionada(doacao);
    };

    return (
        <div className="min-h-screen">
            {/* Faixa do topo: voltar, título e filtros */}
            <FaixaTopo
                eyebrow="Doações"
                titulo="Doações Disponíveis"
                descricao="Encontre alimentos perto de você e ajude a combater o desperdício."
            >
                <FiltrosDoacoes
                    busca={busca}
                    setBusca={setBusca}
                    categoriaSelecionada={categoriaSelecionada}
                    setCategoriaSelecionada={setCategoriaSelecionada}
                    statusSelecionado={statusSelecionado}
                    setStatusSelecionado={setStatusSelecionado}
                    ordenacaoSelecionada={ordenacaoSelecionada}
                    setOrdenacaoSelecionada={setOrdenacaoSelecionada}
                />
            </FaixaTopo>

            {/* Lista, com o mesmo fundo da home: pontilhado e fatias de laranja (mais suaves) */}
            <FundoPagina>

                <main className="pb-10 md:pb-14">
                    {filtrando ? (
                        <div className="container-largo pt-10 md:pt-14">
                            <ContadorResultados quantidade={doacoesFiltradas.length} singular="doação" plural="doações" />

                            {doacoesFiltradas.length === 0 ? (
                                <EstadoVazio
                                    simples
                                    titulo="Nenhuma doação encontrada"
                                    texto="Tente buscar por outro nome ou limpar os filtros."
                                />
                            ) : (
                                <GradeDoacoes doacoes={doacoesOrdenadas} onVerDetalhes={abrirDetalhes} />
                            )}
                        </div>
                    ) : (
                        <>
                            <SecaoVencemPrimeiro doacoes={doacoes} onVerDetalhes={abrirDetalhes} />

                            <div className="pt-8">
                                <SecoesPorCategoria doacoes={doacoesOrdenadas} onVerDetalhes={abrirDetalhes} />
                            </div>
                        </>
                    )}
                </main>
            </FundoPagina>

            {doacaoSelecionada && (
                <ModalDoacao
                    doacao={doacaoSelecionada}
                    onFechar={() => setDoacaoSelecionada(null)}
                />
            )}
        </div>
    );
}

export default Doacoes;
