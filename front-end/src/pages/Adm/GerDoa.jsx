import { useState } from "react";
import { Link } from "react-router-dom";
import FaixaTopo from "../../components/Layout/FaixaTopo";
import FundoPagina from "../../components/Layout/FundoPagina";
import BarraFiltros from "../../components/Comuns/BarraFiltros";
import BotaoConfirmar from "../../components/Comuns/BotaoConfirmar";
import ContadorResultados from "../../components/Comuns/ContadorResultados";
import EstadoVazio from "../../components/Comuns/EstadoVazio";
import { Carregando, ErroAoCarregar } from "../../components/Comuns/EstadoRequisicao";
import SeloStatus from "../../components/Doacoes/SeloStatus";
import { useCarregar } from "../../hooks/useCarregar";
import { cancelarDoacaoComoAdmin, listarTodasAsDoacoes } from "../../services/adminService";
import { statusDaDoacao } from "../../services/ordenacaoDoacoes";
import { STATUS_DOACAO } from "../../data/opcoesDoacao";

// Gerenciar doações: todas as doações do site, com quem cadastrou cada uma, e a moderação (cancelar)
function GerDoa() {
    const { dados, erro, recarregar } = useCarregar(listarTodasAsDoacoes);
    const [busca, setBusca] = useState("");
    const [statusSelecionado, setStatusSelecionado] = useState("Todos");
    const [aviso, setAviso] = useState("");
    const [erroAcao, setErroAcao] = useState("");

    const doacoes = dados ?? [];
    const termo = busca.trim().toLowerCase();
    const filtradas = doacoes.filter((doacao) =>
        (statusSelecionado === "Todos" || statusDaDoacao(doacao) === statusSelecionado) &&
        [doacao.titulo, doacao.doador, doacao.dono.nome, doacao.dono.email].some((texto) => texto.toLowerCase().includes(termo))
    );

    async function handleCancelar(doacao) {
        setAviso("");
        setErroAcao("");
        try {
            await cancelarDoacaoComoAdmin(doacao.id);
            setAviso(`A doação "${doacao.titulo}" foi cancelada. Os pedidos em aberto dela foram cancelados junto.`);
            recarregar();
        } catch (erroApi) {
            setErroAcao(erroApi.message);
        }
    }

    return (
        <div className="min-h-screen">
            <FaixaTopo
                eyebrow="Administração"
                titulo="Gerenciar doações"
                descricao="Todas as doações do site. Cancele as que forem impróprias: os pedidos em aberto delas são cancelados junto."
            >
                <BarraFiltros>
                    <input
                        type="search"
                        placeholder="Buscar por alimento, doador ou e-mail..."
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
                        {STATUS_DOACAO.map((status) => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </BarraFiltros>
            </FaixaTopo>

            <FundoPagina>
                <main className="container-largo py-10 md:py-14">
                    {aviso && <p role="status" className="aviso-sucesso mb-6">{aviso}</p>}
                    {erroAcao && <p role="alert" className="aviso-erro mb-6">{erroAcao}</p>}

                    {erro ? (
                        <ErroAoCarregar erro={erro} onTentarNovamente={recarregar} titulo="Não foi possível carregar as doações" />
                    ) : !dados ? (
                        <Carregando texto="Carregando as doações..." />
                    ) : doacoes.length === 0 ? (
                        <EstadoVazio eyebrow="Nenhuma doação" titulo="Ainda não há doações no site" />
                    ) : (
                        <>
                            <ContadorResultados quantidade={filtradas.length} total={doacoes.length} singular="doação" plural="doações" />

                            {filtradas.length === 0 ? (
                                <EstadoVazio simples titulo="Nenhuma doação encontrada" texto="Tente outra busca ou outro status." />
                            ) : (
                                <div className="overflow-x-auto rounded-2xl bg-white shadow-card">
                                    <table className="w-full min-w-[54rem] text-left text-sm">
                                        <thead className="bg-cream text-xs font-semibold uppercase tracking-wider text-ink-soft">
                                            <tr>
                                                <th scope="col" className="px-4 py-3">Doação</th>
                                                <th scope="col" className="px-4 py-3">Cadastrada por</th>
                                                <th scope="col" className="px-4 py-3">Local</th>
                                                <th scope="col" className="px-4 py-3">Validade</th>
                                                <th scope="col" className="px-4 py-3">Status</th>
                                                <th scope="col" className="px-4 py-3"><span className="sr-only">Ações</span></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filtradas.map((doacao) => {
                                                const status = statusDaDoacao(doacao);
                                                const podeCancelar = doacao.status !== "Concluída" && doacao.status !== "Cancelada";
                                                return (
                                                    <tr key={doacao.id} className="border-t border-line align-middle">
                                                        <td className="px-4 py-3">
                                                            <Link to={`/detalhes/${doacao.id}`} className="font-semibold text-forest-dark hover:underline">
                                                                {doacao.titulo}
                                                            </Link>
                                                            <p className="text-xs text-ink-soft">{doacao.categoria} · {doacao.quantidade}</p>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <p className="font-medium text-ink">{doacao.dono.nome}</p>
                                                            <p className="text-xs text-ink-soft">{doacao.dono.email}</p>
                                                        </td>
                                                        <td className="px-4 py-3 text-ink-soft">{doacao.local}</td>
                                                        <td className="px-4 py-3 text-ink-soft">{doacao.validade}</td>
                                                        <td className="px-4 py-3"><SeloStatus status={status} /></td>
                                                        <td className="w-56 px-4 py-3">
                                                            {podeCancelar && (
                                                                <div className="flex">
                                                                    <BotaoConfirmar
                                                                        texto="Cancelar"
                                                                        pergunta="Cancelar esta doação?"
                                                                        className="btn-outline btn-sm hover:border-terracotta-dark/40 hover:text-terracotta-dark"
                                                                        onConfirmar={() => handleCancelar(doacao)}
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

export default GerDoa;
