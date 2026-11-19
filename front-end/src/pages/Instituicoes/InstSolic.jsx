import { useState } from "react";
import { Link } from "react-router-dom";
import FaixaTopo from "../../components/Layout/FaixaTopo";
import FundoPagina from "../../components/Layout/FundoPagina";
import BarraFiltros from "../../components/Comuns/BarraFiltros";
import BotaoConfirmar from "../../components/Comuns/BotaoConfirmar";
import ContadorResultados from "../../components/Comuns/ContadorResultados";
import EstadoVazio from "../../components/Comuns/EstadoVazio";
import { Carregando, ErroAoCarregar } from "../../components/Comuns/EstadoRequisicao";
import { ArrowIcon } from "../../components/Comuns/Icons";
import SeloStatus from "../../components/Doacoes/SeloStatus";
import AvisoSoParaInstituicoes from "../../components/Instituicoes/AvisoSoParaInstituicoes";
import { useAuth } from "../../hooks/useAuth";
import { useCarregar } from "../../hooks/useCarregar";
import { ehInstituicao } from "../../services/instituicoesService";
import { alterarStatusSolicitacao, listarSolicitacoesFeitas } from "../../services/solicitacoesService";
import { STATUS_SOLICITACAO } from "../../data/opcoesDoacao";

// Solicitações da instituição: todos os pedidos feitos por ela, em tabela, com filtro de status
function InstSolic() {
    const { usuario } = useAuth();
    const { dados, erro, recarregar } = useCarregar(listarSolicitacoesFeitas);
    const [busca, setBusca] = useState("");
    const [statusSelecionado, setStatusSelecionado] = useState("Todos");
    const [erroAcao, setErroAcao] = useState("");

    const pedidos = dados ?? [];
    const termo = busca.trim().toLowerCase();
    const filtrados = pedidos.filter((pedido) =>
        (statusSelecionado === "Todos" || pedido.status === statusSelecionado) &&
        [pedido.doacaoTitulo, pedido.doadorNome].some((texto) => texto.toLowerCase().includes(termo))
    );

    async function handleCancelar(pedido) {
        setErroAcao("");
        try {
            await alterarStatusSolicitacao(pedido.id, "Cancelada");
            recarregar();
        } catch (erroApi) {
            setErroAcao(erroApi.message);
        }
    }

    return (
        <div className="min-h-screen">
            <FaixaTopo
                eyebrow="Área da instituição"
                titulo="Solicitações da instituição"
                descricao="Os pedidos de doação que a sua instituição fez, do envio até a entrega."
                acao={
                    <Link to="/solicitacoes/nova" className="btn-primary">
                        Nova solicitação
                        <ArrowIcon className="h-4 w-4" />
                    </Link>
                }
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
                    </BarraFiltros>
                )}
            </FaixaTopo>

            <FundoPagina>
                <main className="container-largo py-10 md:py-14">
                    {erroAcao && <p role="alert" className="aviso-erro mb-6">{erroAcao}</p>}

                    {!ehInstituicao(usuario) ? (
                        <AvisoSoParaInstituicoes />
                    ) : erro ? (
                        <ErroAoCarregar erro={erro} onTentarNovamente={recarregar} titulo="Não foi possível carregar os pedidos" />
                    ) : !dados ? (
                        <Carregando texto="Carregando os pedidos..." />
                    ) : pedidos.length === 0 ? (
                        <EstadoVazio
                            eyebrow="Nenhum pedido ainda"
                            titulo="Sua instituição ainda não pediu doações"
                            texto="Encontre uma doação disponível e clique em “Solicitar doação”."
                            acao={<Link to="/doacoes" className="btn-primary">Ver doações disponíveis</Link>}
                        />
                    ) : (
                        <>
                            <ContadorResultados quantidade={filtrados.length} total={pedidos.length} singular="pedido" plural="pedidos" masculino />

                            {filtrados.length === 0 ? (
                                <EstadoVazio simples titulo="Nenhum pedido encontrado" texto="Tente outra busca ou outro status." />
                            ) : (
                                <div className="overflow-x-auto rounded-2xl bg-white shadow-card">
                                    <table className="w-full min-w-[56rem] text-left text-sm">
                                        <thead className="bg-cream text-xs font-semibold uppercase tracking-wider text-ink-soft">
                                            <tr>
                                                <th scope="col" className="px-4 py-3">Doação</th>
                                                <th scope="col" className="px-4 py-3">Doador</th>
                                                <th scope="col" className="px-4 py-3">Quantidade</th>
                                                <th scope="col" className="px-4 py-3">Retirada</th>
                                                <th scope="col" className="px-4 py-3">Status</th>
                                                <th scope="col" className="px-4 py-3"><span className="sr-only">Ações</span></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filtrados.map((pedido) => {
                                                const aberto = pedido.status === "Pendente" || pedido.status === "Aceita";
                                                return (
                                                    <tr key={pedido.id} className="border-t border-line align-middle">
                                                        <td className="px-4 py-3">
                                                            <Link to={`/detalhes/${pedido.doacaoId}`} className="font-semibold text-forest-dark hover:underline">
                                                                {pedido.doacaoTitulo}
                                                            </Link>
                                                            <p className="text-xs text-ink-soft">Pedido em {pedido.dataCriacao}</p>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <p className="text-ink">{pedido.doadorNome}</p>
                                                            {/* O telefone do doador só vem depois que ele aceita o pedido */}
                                                            {pedido.doacao.contato && pedido.status === "Aceita" && (
                                                                <p className="text-xs font-semibold text-forest-dark">{pedido.doacao.contato}</p>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3 text-ink-soft">{pedido.quantidade}</td>
                                                        <td className="px-4 py-3 text-ink-soft">{pedido.dataRetirada}</td>
                                                        <td className="px-4 py-3">
                                                            <SeloStatus status={pedido.status} rotulo={pedido.status === "Concluída" ? "Entregue" : undefined} />
                                                        </td>
                                                        <td className="w-56 px-4 py-3">
                                                            {aberto && (
                                                                <div className="flex">
                                                                    <BotaoConfirmar
                                                                        texto="Cancelar pedido"
                                                                        pergunta="Cancelar este pedido?"
                                                                        className="btn-outline btn-sm hover:border-terracotta-dark/40 hover:text-terracotta-dark"
                                                                        onConfirmar={() => handleCancelar(pedido)}
                                                                    />
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </FundoPagina>
        </div>
    );
}

export default InstSolic;
