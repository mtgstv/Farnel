import { useState } from "react";
import FaixaTopo from "../../components/Layout/FaixaTopo";
import FundoPagina from "../../components/Layout/FundoPagina";
import BotaoConfirmar from "../../components/Comuns/BotaoConfirmar";
import ContadorResultados from "../../components/Comuns/ContadorResultados";
import EstadoVazio from "../../components/Comuns/EstadoVazio";
import { Carregando, ErroAoCarregar } from "../../components/Comuns/EstadoRequisicao";
import { useCarregar } from "../../hooks/useCarregar";
import { alterarVerificacao, listarInstituicoesAdmin } from "../../services/adminService";

// Gerenciar instituições: as contas "ONG ou instituição", as que esperam verificação primeiro.
// Só as verificadas aparecem na lista pública da Área da instituição.
function GerInst() {
    const { dados, erro, recarregar } = useCarregar(listarInstituicoesAdmin);
    const [aviso, setAviso] = useState("");
    const [erroAcao, setErroAcao] = useState("");

    const instituicoes = dados ?? [];
    const aguardando = instituicoes.filter((instituicao) => !instituicao.verificada).length;

    async function handleVerificacao(instituicao, verificada) {
        setAviso("");
        setErroAcao("");
        try {
            await alterarVerificacao(instituicao.id, verificada);
            setAviso(
                verificada
                    ? `${instituicao.nome} foi verificada e já aparece na lista pública de instituições.`
                    : `${instituicao.nome} não está mais verificada.`
            );
            recarregar();
        } catch (erroApi) {
            setErroAcao(erroApi.message);
        }
    }

    return (
        <div className="min-h-screen">
            <FaixaTopo
                eyebrow="Administração"
                titulo="Gerenciar instituições"
                descricao="Confira os dados das ONGs e cozinhas solidárias e marque as verificadas: só elas aparecem na lista pública."
            />

            <FundoPagina>
                <main className="container-largo py-10 md:py-14">
                    {aviso && <p role="status" className="aviso-sucesso mb-6">{aviso}</p>}
                    {erroAcao && <p role="alert" className="aviso-erro mb-6">{erroAcao}</p>}

                    {erro ? (
                        <ErroAoCarregar erro={erro} onTentarNovamente={recarregar} titulo="Não foi possível carregar as instituições" />
                    ) : !dados ? (
                        <Carregando texto="Carregando as instituições..." />
                    ) : instituicoes.length === 0 ? (
                        <EstadoVazio
                            eyebrow="Nenhuma instituição"
                            titulo="Ainda não há instituições cadastradas"
                            texto="Uma conta vira instituição quando escolhe “ONG ou instituição” no perfil."
                        />
                    ) : (
                        <>
                            <ContadorResultados quantidade={instituicoes.length} singular="instituição" plural="instituições" />
                            {aguardando > 0 && (
                                <p className="mb-4 text-sm font-semibold text-terracotta-dark">
                                    {aguardando} {aguardando === 1 ? "instituição aguardando" : "instituições aguardando"} verificação
                                </p>
                            )}

                            <div className="overflow-x-auto rounded-2xl bg-white shadow-card">
                                <table className="w-full min-w-[56rem] text-left text-sm">
                                    <thead className="bg-cream text-xs font-semibold uppercase tracking-wider text-ink-soft">
                                        <tr>
                                            <th scope="col" className="px-4 py-3">Instituição</th>
                                            <th scope="col" className="px-4 py-3">Cidade</th>
                                            <th scope="col" className="px-4 py-3">Sobre</th>
                                            <th scope="col" className="px-4 py-3 text-right">Doações recebidas</th>
                                            <th scope="col" className="px-4 py-3">Situação</th>
                                            <th scope="col" className="px-4 py-3"><span className="sr-only">Ações</span></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {instituicoes.map((instituicao) => (
                                            <tr key={instituicao.id} className="border-t border-line align-middle">
                                                <td className="px-4 py-3">
                                                    <p className="font-semibold text-ink">{instituicao.nome}</p>
                                                    <p className="text-xs text-ink-soft">{instituicao.email}</p>
                                                </td>
                                                <td className="px-4 py-3 text-ink-soft">
                                                    {instituicao.cidade ? `${instituicao.cidade}${instituicao.uf ? `/${instituicao.uf}` : ""}` : "—"}
                                                </td>
                                                <td className="max-w-xs px-4 py-3 text-ink-soft">
                                                    <p className="line-clamp-2">{instituicao.sobre ?? "—"}</p>
                                                </td>
                                                <td className="px-4 py-3 text-right tabular-nums text-ink">{instituicao.doacoesRecebidas}</td>
                                                <td className="px-4 py-3">
                                                    {instituicao.verificada ? (
                                                        <span className="inline-flex whitespace-nowrap rounded-full bg-forest/10 px-3 py-1 text-xs font-semibold text-forest-dark">✓ Verificada</span>
                                                    ) : (
                                                        <span className="inline-flex whitespace-nowrap rounded-full bg-terracotta/10 px-3 py-1 text-xs font-semibold text-terracotta-dark">Aguardando</span>
                                                    )}
                                                </td>
                                                <td className="w-60 px-4 py-3">
                                                    <div className="flex">
                                                        <BotaoConfirmar
                                                            texto={instituicao.verificada ? "Tirar verificação" : "Verificar"}
                                                            pergunta={instituicao.verificada ? "Tirar a verificação?" : "Verificar esta instituição?"}
                                                            className={instituicao.verificada ? "btn-outline btn-sm" : "btn-primary btn-sm"}
                                                            onConfirmar={() => handleVerificacao(instituicao, !instituicao.verificada)}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </main>
            </FundoPagina>
        </div>
    );
}

export default GerInst;
