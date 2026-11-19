import { useState } from "react";
import FaixaTopo from "../../components/Layout/FaixaTopo";
import FundoPagina from "../../components/Layout/FundoPagina";
import BarraFiltros from "../../components/Comuns/BarraFiltros";
import BotaoConfirmar from "../../components/Comuns/BotaoConfirmar";
import ContadorResultados from "../../components/Comuns/ContadorResultados";
import EstadoVazio from "../../components/Comuns/EstadoVazio";
import { Carregando, ErroAoCarregar } from "../../components/Comuns/EstadoRequisicao";
import { useAuth } from "../../hooks/useAuth";
import { useCarregar } from "../../hooks/useCarregar";
import { alterarPapel, listarUsuarios } from "../../services/adminService";

const NOMES_PAPEL = { ADMIN: "Administrador", USUARIO: "Usuário" };

// Gerenciar usuários: todas as contas, com quantas doações e pedidos cada uma tem, e quem é administrador
function GerUsuario() {
    const { usuario: eu } = useAuth();
    const { dados, erro, recarregar } = useCarregar(listarUsuarios);
    const [busca, setBusca] = useState("");
    const [papelSelecionado, setPapelSelecionado] = useState("Todos");
    const [aviso, setAviso] = useState("");
    const [erroAcao, setErroAcao] = useState("");

    const usuarios = dados ?? [];
    const termo = busca.trim().toLowerCase();
    const filtrados = usuarios.filter((conta) =>
        (papelSelecionado === "Todos" || conta.papel === papelSelecionado) &&
        [conta.nome, conta.email, conta.organizacao ?? ""].some((texto) => texto.toLowerCase().includes(termo))
    );

    async function handleMudarPapel(conta, papel) {
        setAviso("");
        setErroAcao("");
        try {
            await alterarPapel(conta.id, papel);
            setAviso(
                papel === "ADMIN"
                    ? `${conta.nome} agora é administrador. O acesso vale a partir do próximo login dessa pessoa (ou em até 15 minutos).`
                    : `${conta.nome} não é mais administrador.`
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
                titulo="Gerenciar usuários"
                descricao="Todas as contas do Farnel. Escolha quem pode acessar a área administrativa."
            >
                <BarraFiltros>
                    <input
                        type="search"
                        placeholder="Buscar por nome, e-mail ou organização..."
                        aria-label="Buscar"
                        value={busca}
                        onChange={(event) => setBusca(event.target.value)}
                        className="campo-filtro"
                    />
                    <select
                        aria-label="Papel"
                        value={papelSelecionado}
                        onChange={(event) => setPapelSelecionado(event.target.value)}
                        className="campo-filtro lg:w-auto"
                    >
                        <option value="Todos">Todos os papéis</option>
                        <option value="USUARIO">Usuários</option>
                        <option value="ADMIN">Administradores</option>
                    </select>
                </BarraFiltros>
            </FaixaTopo>

            <FundoPagina>
                <main className="container-largo py-10 md:py-14">
                    {aviso && <p role="status" className="aviso-sucesso mb-6">{aviso}</p>}
                    {erroAcao && <p role="alert" className="aviso-erro mb-6">{erroAcao}</p>}

                    {erro ? (
                        <ErroAoCarregar erro={erro} onTentarNovamente={recarregar} titulo="Não foi possível carregar as contas" />
                    ) : !dados ? (
                        <Carregando texto="Carregando as contas..." />
                    ) : (
                        <>
                            <ContadorResultados quantidade={filtrados.length} total={usuarios.length} singular="conta" plural="contas" />

                            {filtrados.length === 0 ? (
                                <EstadoVazio simples titulo="Nenhuma conta encontrada" texto="Tente outra busca ou outro papel." />
                            ) : (
                                <div className="overflow-x-auto rounded-2xl bg-white shadow-card">
                                    <table className="w-full min-w-[58rem] text-left text-sm">
                                        <thead className="bg-cream text-xs font-semibold uppercase tracking-wider text-ink-soft">
                                            <tr>
                                                <th scope="col" className="px-4 py-3">Conta</th>
                                                <th scope="col" className="px-4 py-3">Participa como</th>
                                                <th scope="col" className="px-4 py-3">Cidade</th>
                                                <th scope="col" className="px-4 py-3">Membro desde</th>
                                                <th scope="col" className="px-4 py-3 text-right">Doações</th>
                                                <th scope="col" className="px-4 py-3 text-right">Pedidos</th>
                                                <th scope="col" className="px-4 py-3">Papel</th>
                                                <th scope="col" className="px-4 py-3"><span className="sr-only">Ações</span></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filtrados.map((conta) => {
                                                const souEu = conta.id === eu.id;
                                                const admin = conta.papel === "ADMIN";
                                                return (
                                                    <tr key={conta.id} className="border-t border-line align-middle">
                                                        <td className="px-4 py-3">
                                                            <p className="font-semibold text-ink">{conta.nome}</p>
                                                            <p className="text-xs text-ink-soft">{conta.email}</p>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <p className="text-ink">{conta.perfil}</p>
                                                            {conta.organizacao && <p className="text-xs text-ink-soft">{conta.organizacao}</p>}
                                                        </td>
                                                        <td className="px-4 py-3 text-ink-soft">
                                                            {conta.cidade ? `${conta.cidade}${conta.uf ? `/${conta.uf}` : ""}` : "—"}
                                                        </td>
                                                        <td className="px-4 py-3 text-ink-soft">
                                                            {new Date(conta.criadoEm).toLocaleDateString("pt-BR")}
                                                        </td>
                                                        <td className="px-4 py-3 text-right tabular-nums text-ink">{conta.doacoes}</td>
                                                        <td className="px-4 py-3 text-right tabular-nums text-ink">{conta.pedidos}</td>
                                                        <td className="px-4 py-3">
                                                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${admin ? "bg-terracotta/10 text-terracotta-dark" : "bg-forest/10 text-forest-dark"}`}>
                                                                {NOMES_PAPEL[conta.papel]}
                                                            </span>
                                                        </td>
                                                        <td className="w-64 px-4 py-3">
                                                            {souEu ? (
                                                                <span className="text-xs text-ink-soft">Esta é a sua conta</span>
                                                            ) : (
                                                                <div className="flex">
                                                                    <BotaoConfirmar
                                                                        texto={admin ? "Tirar acesso de administrador" : "Tornar administrador"}
                                                                        pergunta={admin ? "Tirar o acesso?" : "Tornar administrador?"}
                                                                        className="btn-outline btn-sm"
                                                                        onConfirmar={() => handleMudarPapel(conta, admin ? "USUARIO" : "ADMIN")}
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

export default GerUsuario;
