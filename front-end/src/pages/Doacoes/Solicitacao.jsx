import { useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import FaixaTopo from "../../components/FaixaTopo";
import FundoPagina from "../../components/FundoPagina";
import FotoDoacao from "../../components/Doacoes/FotoDoacao";
import SeloStatus from "../../components/Doacoes/SeloStatus";
import BarraFiltros from "../../components/BarraFiltros";
import BotaoConfirmar from "../../components/BotaoConfirmar";
import ContadorResultados from "../../components/ContadorResultados";
import EstadoVazio from "../../components/EstadoVazio";
import { ArrowIcon } from "../../components/Icons";
import { getUsuarioLogado } from "../../services/authStorage";
import { getDoacoes } from "../../services/doacoesStorage";
import { alterarStatusSolicitacao, getSolicitacoes } from "../../services/solicitacoesStorage";
import { converterData } from "../../services/ordenacaoDoacoes";
import { STATUS_SOLICITACAO } from "../../data/opcoesDoacao";

const ENCERRADAS = ["Concluída", "Recusada", "Cancelada"];

const ABAS = [
    { id: "feitas", rotulo: "Feitas por mim" },
    { id: "recebidas", rotulo: "Recebidas nas minhas doações" },
];

const ORDENACOES = {
    recentes: (a, b) => b.id - a.id,
    retirada: (a, b) => converterData(a.dataRetirada) - converterData(b.dataRetirada),
};

const BOTAO_CANCELAR = "btn-outline btn-sm flex-1 hover:border-red-300 hover:text-red-700";
const BOTAO_PRINCIPAL = "btn-primary btn-sm flex-1";

function Detalhe({ rotulo, children }) {
    return (
        <p className="text-sm">
            <span className="font-semibold text-ink">{rotulo}:</span>{" "}
            <span className="text-ink-soft">{children}</span>
        </p>
    );
}

function CartaoSolicitacao({ solicitacao, doacao, aba, onAlterarStatus }) {
    const { status } = solicitacao;
    const encerrada = ENCERRADAS.includes(status);
    // Para a foto: a doação atual ou, se ela não existir mais, só o título guardado no pedido.
    const doacaoDaFoto = doacao ?? { titulo: solicitacao.doacaoTitulo, imagem: null };

    return (
        <article className={`flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-forest/5 transition ${encerrada ? "opacity-70 saturate-50 hover:opacity-95" : ""}`}>
            <div className="relative h-36 flex-none overflow-hidden">
                <FotoDoacao doacao={doacaoDaFoto} className="h-full w-full" />
                <SeloStatus
                    status={status}
                    sobreFoto
                    rotulo={status === "Concluída" ? "Entregue" : undefined}
                    className="absolute left-3 top-3"
                />
            </div>

            <div className="flex flex-1 flex-col p-5">
                {doacao && (
                    <p className="rotulo-categoria">{doacao.categoria}</p>
                )}
                <h2 className="mt-1 text-lg font-semibold">{solicitacao.doacaoTitulo}</h2>

                <div className="mt-3 flex flex-col gap-1.5">
                    {aba === "feitas" ? (
                        <Detalhe rotulo="Doador">{solicitacao.doadorNome}</Detalhe>
                    ) : (
                        <>
                            <Detalhe rotulo="Pedido por">{solicitacao.solicitanteNome} ({solicitacao.tipoSolicitante})</Detalhe>
                            <Detalhe rotulo="Contato">{solicitacao.contato}</Detalhe>
                        </>
                    )}
                    <Detalhe rotulo="Quantidade">{solicitacao.quantidade}</Detalhe>
                    <Detalhe rotulo="Retirada">
                        {solicitacao.dataRetirada}
                        {solicitacao.horario && ` · ${solicitacao.horario}`}
                    </Detalhe>
                    <Detalhe rotulo="Forma">{solicitacao.forma}</Detalhe>

                    {/* quem pediu recebe o contato do doador quando o pedido é aceito */}
                    {aba === "feitas" && status === "Aceita" && doacao?.contato && (
                        <p className="mt-1 rounded-lg bg-forest/10 px-3 py-2 text-sm font-semibold text-forest-dark">
                            Pedido aceito! Combine com o doador: {doacao.contato}
                        </p>
                    )}
                </div>

                {solicitacao.mensagem && (
                    <blockquote className="mt-3 line-clamp-3 border-l-2 border-terracotta/40 pl-3 text-sm italic text-ink-soft">
                        “{solicitacao.mensagem}”
                    </blockquote>
                )}

                <p className="mt-3 text-xs text-ink-soft">Pedido feito em {solicitacao.dataCriacao}</p>

                <div className="mt-auto flex flex-col gap-2 pt-4">
                    {aba === "feitas" && (status === "Pendente" || status === "Aceita") && (
                        <div className="flex">
                            <BotaoConfirmar
                                texto="Cancelar pedido"
                                pergunta="Cancelar este pedido?"
                                className={BOTAO_CANCELAR}
                                onConfirmar={() => onAlterarStatus(solicitacao.id, "Cancelada")}
                            />
                        </div>
                    )}

                    {aba === "recebidas" && status === "Pendente" && (
                        <div className="flex gap-2">
                            <button type="button" onClick={() => onAlterarStatus(solicitacao.id, "Aceita")} className={BOTAO_PRINCIPAL}>
                                Aceitar
                            </button>
                            <BotaoConfirmar
                                texto="Recusar"
                                pergunta="Recusar?"
                                className={BOTAO_CANCELAR}
                                onConfirmar={() => onAlterarStatus(solicitacao.id, "Recusada")}
                            />
                        </div>
                    )}

                    {aba === "recebidas" && status === "Aceita" && (
                        <div className="flex">
                            <BotaoConfirmar
                                texto="✓ Marcar como entregue"
                                pergunta="O alimento foi entregue?"
                                className={BOTAO_PRINCIPAL}
                                onConfirmar={() => onAlterarStatus(solicitacao.id, "Concluída")}
                            />
                        </div>
                    )}

                    {doacao && (
                        <Link to={`/detalhes/${doacao.id}`} className="btn-secundario btn-sm">
                            Ver doação
                        </Link>
                    )}
                </div>
            </div>
        </article>
    );
}

function Solicitacao() {
    const usuario = getUsuarioLogado();
    const location = useLocation();
    const [parametros, setParametros] = useSearchParams();
    const aba = parametros.get("aba") === "recebidas" ? "recebidas" : "feitas";

    const [, setAtualizacoes] = useState(0); // força reler os dados depois de uma ação
    const [busca, setBusca] = useState("");
    const [statusSelecionado, setStatusSelecionado] = useState("Todos");
    const [ordenacao, setOrdenacao] = useState("recentes");
    const [aviso, setAviso] = useState(location.state?.aviso ?? "");

    const doacoes = getDoacoes();
    const doacaoPorId = new Map(doacoes.map((doacao) => [doacao.id, doacao]));
    const todas = getSolicitacoes();

    const porAba = {
        feitas: todas.filter((solicitacao) => solicitacao.solicitanteId === usuario.id),
        recebidas: todas.filter((solicitacao) => doacaoPorId.get(solicitacao.doacaoId)?.usuarioId === usuario.id),
    };

    const termo = busca.trim().toLowerCase();
    const lista = porAba[aba]
        .filter((solicitacao) =>
            (statusSelecionado === "Todos" || solicitacao.status === statusSelecionado) &&
            (solicitacao.doacaoTitulo.toLowerCase().includes(termo) ||
                solicitacao.solicitanteNome.toLowerCase().includes(termo))
        )
        .sort(ORDENACOES[ordenacao]);

    function trocarAba(novaAba) {
        setParametros({ aba: novaAba }, { replace: true });
        setAviso("");
    }

    function handleAlterarStatus(id, status) {
        alterarStatusSolicitacao(id, status);
        setAtualizacoes((valor) => valor + 1);
    }

    return (
        <div className="min-h-screen">
            <FaixaTopo
                eyebrow="Minha conta"
                titulo="Solicitações"
                descricao="Acompanhe os pedidos que você fez e os que recebeu nas suas doações."
                acao={
                    <Link to="/solicitacoes/nova" className="btn-primary">
                        Nova solicitação
                        <ArrowIcon className="h-4 w-4" />
                    </Link>
                }
            >
                <div role="tablist" aria-label="Tipo de solicitação" className="mb-5 flex flex-wrap gap-2">
                    {ABAS.map(({ id, rotulo }) => {
                        const ativa = aba === id;
                        return (
                            <button
                                key={id}
                                type="button"
                                role="tab"
                                aria-selected={ativa}
                                onClick={() => trocarAba(id)}
                                className={`inline-flex items-center gap-2 rounded-full py-2 pl-4 pr-2 text-sm font-semibold ring-1 transition ${ativa
                                    ? "bg-white text-forest-dark ring-white"
                                    : "bg-white/10 text-cream ring-white/20 hover:bg-white/15"
                                    }`}
                            >
                                {rotulo}
                                <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-terracotta px-2 text-xs font-bold text-white">
                                    {porAba[id].length}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <BarraFiltros>
                    <input
                        type="search"
                        placeholder="Buscar por alimento ou pessoa..."
                        aria-label="Buscar"
                        value={busca}
                        onChange={(event) => setBusca(event.target.value)}
                        className="campo-filtro"
                    />
                    <select
                        aria-label="Status"
                        value={statusSelecionado}
                        onChange={(event) => setStatusSelecionado(event.target.value)}
                        className="campo-filtro lg:w-auto"
                    >
                        <option value="Todos">Todos os status</option>
                        {STATUS_SOLICITACAO.map((status) => (
                            <option key={status} value={status}>{status === "Concluída" ? "Entregue" : status}</option>
                        ))}
                    </select>
                    <select
                        aria-label="Ordenar por"
                        value={ordenacao}
                        onChange={(event) => setOrdenacao(event.target.value)}
                        className="campo-filtro lg:w-auto"
                    >
                        <option value="recentes">Mais recentes</option>
                        <option value="retirada">Retirada mais próxima</option>
                    </select>
                </BarraFiltros>
            </FaixaTopo>

            <FundoPagina>
                <main className="container-largo py-10 md:py-14">
                    {aviso && (
                        <div role="status" className="aviso-sucesso mb-6 flex items-center justify-between gap-4">
                            {aviso}
                            <button type="button" onClick={() => setAviso("")} aria-label="Fechar aviso" className="text-lg leading-none">
                                ×
                            </button>
                        </div>
                    )}

                    {porAba[aba].length === 0 ? (
                        aba === "feitas" ? (
                            <EstadoVazio
                                eyebrow="Nenhum pedido ainda"
                                titulo="Você ainda não pediu nenhuma doação"
                                texto="Encontre uma doação disponível e clique em “Solicitar doação”."
                                acao={
                                    <Link to="/doacoes" className="btn-primary">
                                        Ver doações disponíveis
                                        <ArrowIcon className="h-4 w-4" />
                                    </Link>
                                }
                            />
                        ) : (
                            <EstadoVazio
                                eyebrow="Nenhum pedido recebido"
                                titulo="Suas doações ainda não receberam pedidos"
                                texto="Quando alguém solicitar uma das suas doações, o pedido aparece aqui."
                                acao={
                                    <Link to="/doacoes/nova" className="btn-primary">
                                        Cadastrar uma doação
                                        <ArrowIcon className="h-4 w-4" />
                                    </Link>
                                }
                            />
                        )
                    ) : (
                        <>
                            <ContadorResultados quantidade={lista.length} total={porAba[aba].length} singular="pedido" plural="pedidos" masculino />

                            {lista.length === 0 ? (
                                <EstadoVazio simples titulo="Nenhum pedido encontrado" texto="Tente outra busca ou outro status." />
                            ) : (
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {lista.map((solicitacao) => (
                                        <CartaoSolicitacao
                                            key={solicitacao.id}
                                            solicitacao={solicitacao}
                                            doacao={doacaoPorId.get(solicitacao.doacaoId)}
                                            aba={aba}
                                            onAlterarStatus={handleAlterarStatus}
                                        />
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

export default Solicitacao;
