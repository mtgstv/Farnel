import { useState } from "react";
import { Link } from "react-router-dom";
import FaixaTopo from "../../components/FaixaTopo";
import FundoPagina from "../../components/FundoPagina";
import DoacaoCard from "../../components/Doacoes/DoacaoCard";
import FiltrosDoacoes from "../../components/Doacoes/FiltrosDoacoes";
import ModalDoacao from "../../components/Doacoes/ModalDoacao";
import { ArrowIcon } from "../../components/Icons";
import EstadoVazio from "../../components/EstadoVazio";
import BotaoConfirmar from "../../components/BotaoConfirmar";
import ContadorResultados from "../../components/ContadorResultados";
import { getUsuarioLogado } from "../../services/authStorage";
import { getDoacoes } from "../../services/doacoesStorage";
import { encerrarDoacao, getSolicitacoes } from "../../services/solicitacoesStorage";
import { ordenarDoacoes, statusDaDoacao } from "../../services/ordenacaoDoacoes";

// Atalhos do topo: cada número também filtra a lista por aquele status.
const RESUMO = [
    { status: "Todos", rotulo: "Doações" },
    { status: "Disponível", rotulo: "Disponíveis" },
    { status: "Solicitada", rotulo: "Solicitadas" },
    { status: "Concluída", rotulo: "Entregues" },
    { status: "Vencida", rotulo: "Vencidas" },
    { status: "Cancelada", rotulo: "Canceladas" },
];

// Rodapé de cada card: encerrar a doação (com confirmação) e ver os pedidos em aberto.
function AcoesDoacao({ doacao, pedidosEmAberto, onEncerrar }) {
    const status = statusDaDoacao(doacao);
    if (status === "Concluída" || status === "Cancelada") return null;

    const ativa = status === "Disponível" || status === "Solicitada";

    return (
        <div className="flex flex-col gap-2">
            {pedidosEmAberto > 0 && (
                <Link
                    to="/solicitacoes?aba=recebidas"
                    className="rounded-full bg-terracotta/10 px-4 py-2.5 text-center text-sm font-semibold text-terracotta-dark transition hover:bg-terracotta/15"
                >
                    {pedidosEmAberto} {pedidosEmAberto === 1 ? "pedido em aberto" : "pedidos em aberto"} →
                </Link>
            )}

            <div className="flex flex-wrap gap-2">
                {ativa && (
                    <BotaoConfirmar
                        texto="✓ Entregue"
                        pergunta="Confirmar que foi entregue?"
                        className="btn-outline btn-sm flex-1"
                        onConfirmar={() => onEncerrar(doacao.id, "Concluída")}
                    />
                )}
                <BotaoConfirmar
                    texto="Cancelar"
                    pergunta="Cancelar esta doação?"
                    className="btn-outline btn-sm flex-1 hover:border-red-300 hover:text-red-700"
                    onConfirmar={() => onEncerrar(doacao.id, "Cancelada")}
                />
            </div>
        </div>
    );
}

function MinhasDoacoes() {
    const usuario = getUsuarioLogado();
    const [, setAtualizacoes] = useState(0); // força reler os dados depois de uma ação

    const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todas");
    const [statusSelecionado, setStatusSelecionado] = useState("Todos");
    const [ordenacaoSelecionada, setOrdenacaoSelecionada] = useState("recentes");
    const [busca, setBusca] = useState("");
    const [doacaoSelecionada, setDoacaoSelecionada] = useState(null);

    const minhas = getDoacoes().filter((doacao) => doacao.usuarioId === usuario.id);
    const solicitacoes = getSolicitacoes();

    const contagem = (status) =>
        status === "Todos" ? minhas.length : minhas.filter((doacao) => statusDaDoacao(doacao) === status).length;

    const filtradas = minhas.filter((doacao) =>
        (categoriaSelecionada === "Todas" || doacao.categoria === categoriaSelecionada) &&
        (statusSelecionado === "Todos" || statusDaDoacao(doacao) === statusSelecionado) &&
        doacao.titulo.toLowerCase().includes(busca.toLowerCase())
    );
    const ordenadas = ordenarDoacoes(filtradas, ordenacaoSelecionada);

    function pedidosEmAberto(doacaoId) {
        return solicitacoes.filter(
            (solicitacao) => solicitacao.doacaoId === doacaoId && ["Pendente", "Aceita"].includes(solicitacao.status)
        ).length;
    }

    function handleEncerrar(doacaoId, status) {
        encerrarDoacao(doacaoId, status);
        setAtualizacoes((valor) => valor + 1);
    }

    return (
        <div className="min-h-screen">
            <FaixaTopo
                eyebrow="Minha conta"
                titulo="Histórico de doações"
                descricao="Tudo o que você já doou, do cadastro até a entrega."
                acao={
                    <Link to="/doacoes/nova" className="btn-primary">
                        Nova doação
                        <ArrowIcon className="h-4 w-4" />
                    </Link>
                }
            >
                {/* resumo: cada número também é um atalho de filtro */}
                <div className="mb-5 grid grid-cols-3 gap-2 sm:grid-cols-6">
                    {RESUMO.map(({ status, rotulo }) => {
                        const ativo = statusSelecionado === status;
                        return (
                            <button
                                key={status}
                                type="button"
                                onClick={() => setStatusSelecionado(status)}
                                aria-pressed={ativo}
                                className={`rounded-2xl px-4 py-3 text-left ring-1 transition ${ativo
                                    ? "bg-white text-forest-dark ring-white"
                                    : "bg-white/10 text-cream ring-white/15 hover:bg-white/15"
                                    }`}
                            >
                                <span className="block font-heading text-2xl font-semibold">{contagem(status)}</span>
                                <span className={`text-xs font-semibold ${ativo ? "text-ink-soft" : "text-cream/90"}`}>{rotulo}</span>
                            </button>
                        );
                    })}
                </div>

                <FiltrosDoacoes
                    busca={busca}
                    setBusca={setBusca}
                    categoriaSelecionada={categoriaSelecionada}
                    setCategoriaSelecionada={setCategoriaSelecionada}
                    statusSelecionado={statusSelecionado}
                    setStatusSelecionado={setStatusSelecionado}
                    ordenacaoSelecionada={ordenacaoSelecionada}
                    setOrdenacaoSelecionada={setOrdenacaoSelecionada}
                    ordenacaoPadrao="recentes"
                />
            </FaixaTopo>

            <FundoPagina>
                <main className="container-largo py-10 md:py-14">
                    {minhas.length === 0 ? (
                        <EstadoVazio
                            eyebrow="Seu histórico começa aqui"
                            titulo="Você ainda não fez nenhuma doação"
                            texto="Quando você cadastrar um alimento para doação, ele aparece aqui, com o status atualizado até a entrega."
                            acao={
                                <Link to="/doacoes/nova" className="btn-primary">
                                    Cadastrar minha primeira doação
                                    <ArrowIcon className="h-4 w-4" />
                                </Link>
                            }
                        />
                    ) : (
                        <>
                            <ContadorResultados quantidade={filtradas.length} total={minhas.length} singular="doação" plural="doações" />

                            {filtradas.length === 0 ? (
                                <EstadoVazio simples titulo="Nenhuma doação encontrada" texto="Tente outro nome ou limpe os filtros." />
                            ) : (
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {ordenadas.map((doacao) => (
                                        <DoacaoCard
                                            key={doacao.id}
                                            doacao={doacao}
                                            onVerDetalhes={setDoacaoSelecionada}
                                            acoes={
                                                <AcoesDoacao
                                                    doacao={doacao}
                                                    pedidosEmAberto={pedidosEmAberto(doacao.id)}
                                                    onEncerrar={handleEncerrar}
                                                />
                                            }
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </main>
            </FundoPagina>

            {doacaoSelecionada && (
                <ModalDoacao doacao={doacaoSelecionada} onFechar={() => setDoacaoSelecionada(null)} />
            )}
        </div>
    );
}

export default MinhasDoacoes;
