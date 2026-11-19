import { Link } from "react-router-dom";
import FaixaTopo from "../../components/Layout/FaixaTopo";
import FundoPagina from "../../components/Layout/FundoPagina";
import EstadoVazio from "../../components/Comuns/EstadoVazio";
import { Carregando, ErroAoCarregar } from "../../components/Comuns/EstadoRequisicao";
import { ArrowIcon, PinIcon } from "../../components/Comuns/Icons";
import { Destaque } from "../../components/Painel/Indicadores";
import { useAuth } from "../../hooks/useAuth";
import { useCarregar } from "../../hooks/useCarregar";
import { ehInstituicao, listarInstituicoes } from "../../services/instituicoesService";
import { buscarMinhaConta } from "../../services/perfilService";
import { listarSolicitacoesFeitas } from "../../services/solicitacoesService";

function Iniciais({ nome }) {
    const letras = nome.trim().split(/\s+/).slice(0, 2).map((parte) => parte[0]?.toUpperCase()).join("");
    return <span className="font-heading text-lg font-semibold text-cream">{letras || "?"}</span>;
}

function SeloVerificada({ verificada }) {
    return verificada ? (
        <span className="inline-flex items-center self-start whitespace-nowrap rounded-full bg-forest/10 px-3 py-1 text-xs font-semibold text-forest-dark">
            ✓ Verificada
        </span>
    ) : (
        <span className="inline-flex items-center self-start whitespace-nowrap rounded-full bg-terracotta/10 px-3 py-1 text-xs font-semibold text-terracotta-dark">
            Aguardando verificação
        </span>
    );
}

// Para a instituição logada: situação da verificação, números e atalhos
function MinhaInstituicao() {
    // Busca a conta de novo: o administrador pode ter verificado a instituição depois do login
    const { dados: conta } = useCarregar(buscarMinhaConta);
    const { dados: pedidos } = useCarregar(listarSolicitacoesFeitas);

    if (!conta) return <Carregando texto="Carregando sua instituição..." />;

    const emAndamento = pedidos ? pedidos.filter((pedido) => pedido.status === "Pendente" || pedido.status === "Aceita").length : "…";
    const recebidas = pedidos ? pedidos.filter((pedido) => pedido.status === "Concluída").length : "…";

    return (
        <section className="cartao flex flex-col gap-6 p-6 sm:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <p className="eyebrow">Sua instituição</p>
                    <h2 className="mt-2 text-2xl font-semibold">{conta.organizacao || conta.nome}</h2>
                    {(conta.cidade || conta.uf) && (
                        <p className="mt-1 text-sm text-ink-soft">{[conta.cidade, conta.uf].filter(Boolean).join("/")}</p>
                    )}
                </div>
                <SeloVerificada verificada={conta.verificada} />
            </div>

            {!conta.verificada && (
                <p className="rounded-xl bg-cream px-4 py-3 text-sm text-ink-soft">
                    A equipe do Farnel vai conferir os dados da sua instituição. Enquanto isso, você já pode pedir doações;
                    depois da verificação, a instituição aparece na lista abaixo.
                </p>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
                <Destaque valor={emAndamento} rotulo="Pedidos em andamento" detalhe="Pendentes ou aceitos" />
                <Destaque valor={recebidas} rotulo="Doações recebidas" detalhe="Pedidos já entregues" />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link to="/instituicao/doacoes" className="btn-primary">
                    Doações recebidas
                    <ArrowIcon className="h-4 w-4" />
                </Link>
                <Link to="/instituicao/solicitacoes" className="btn-outline">Solicitações da instituição</Link>
                <Link to="/doacoes" className="btn-outline">Pedir uma doação</Link>
                <Link to="/perfil" className="btn-outline">Editar dados</Link>
            </div>
        </section>
    );
}

// Para quem ainda não participa como instituição
function ComoParticipar({ logado }) {
    const passos = [
        logado ? "Abra o seu perfil." : "Crie uma conta no Farnel.",
        "Em “Você participa como”, escolha “ONG ou instituição” e informe o nome da instituição.",
        "A equipe do Farnel confere os dados e marca a instituição como verificada.",
    ];

    return (
        <section className="cartao flex flex-col gap-5 p-6 sm:p-8">
            <div>
                <p className="eyebrow">Sua instituição recebe doações?</p>
                <h2 className="mt-2 text-2xl font-semibold">Participe como instituição</h2>
            </div>
            <ol className="flex flex-col gap-2 text-sm text-ink">
                {passos.map((passo, indice) => (
                    <li key={passo} className="flex gap-3">
                        <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-forest text-xs font-bold text-cream">
                            {indice + 1}
                        </span>
                        {passo}
                    </li>
                ))}
            </ol>
            <Link to={logado ? "/perfil" : "/cadastro"} className="btn-primary self-start">
                {logado ? "Abrir meu perfil" : "Criar conta"}
                <ArrowIcon className="h-4 w-4" />
            </Link>
        </section>
    );
}

// Área da instituição: o resumo da instituição logada e a lista pública das verificadas
function Instituicao() {
    const { usuario } = useAuth();
    const { dados: instituicoes, erro, recarregar } = useCarregar(listarInstituicoes);

    return (
        <div className="min-h-screen">
            <FaixaTopo
                eyebrow="Instituições"
                titulo="Área da instituição"
                descricao="ONGs, cozinhas solidárias, escolas e creches que recebem doações pelo Farnel."
            />

            <FundoPagina>
                <main className="container-largo flex flex-col gap-10 py-10 md:py-14">
                    {ehInstituicao(usuario) ? <MinhaInstituicao /> : <ComoParticipar logado={Boolean(usuario)} />}

                    <section>
                        <h2 className="text-2xl font-semibold">Instituições verificadas</h2>
                        <p className="mt-1 text-sm text-ink-soft">Conferidas pela equipe do Farnel.</p>

                        <div className="mt-6">
                            {erro ? (
                                <ErroAoCarregar erro={erro} onTentarNovamente={recarregar} titulo="Não foi possível carregar as instituições" />
                            ) : !instituicoes ? (
                                <Carregando texto="Carregando instituições..." />
                            ) : instituicoes.length === 0 ? (
                                <EstadoVazio simples titulo="Nenhuma instituição verificada ainda" texto="Assim que a primeira for verificada, ela aparece aqui." />
                            ) : (
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {instituicoes.map((instituicao) => (
                                        <article key={instituicao.id} className="cartao flex flex-col gap-3 p-6">
                                            <div className="flex items-center gap-3">
                                                <span className="flex h-12 w-12 flex-none items-center justify-center overflow-hidden rounded-full bg-forest">
                                                    {instituicao.foto ? (
                                                        <img src={instituicao.foto} alt="" className="h-full w-full object-cover" />
                                                    ) : (
                                                        <Iniciais nome={instituicao.nome} />
                                                    )}
                                                </span>
                                                <div className="min-w-0">
                                                    <h3 className="truncate text-lg font-semibold">{instituicao.nome}</h3>
                                                    {(instituicao.cidade || instituicao.uf) && (
                                                        <p className="flex items-center gap-1 text-sm text-ink-soft">
                                                            <PinIcon className="h-4 w-4 text-terracotta" />
                                                            {[instituicao.cidade, instituicao.uf].filter(Boolean).join("/")}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            {instituicao.sobre && <p className="text-sm leading-relaxed text-ink-soft">{instituicao.sobre}</p>}
                                            <p className="mt-auto flex flex-wrap items-center gap-2 pt-2 text-sm">
                                                <SeloVerificada verificada />
                                                <span className="font-semibold text-ink">
                                                    {instituicao.doacoesRecebidas}{" "}
                                                    {instituicao.doacoesRecebidas === 1 ? "doação recebida" : "doações recebidas"}
                                                </span>
                                            </p>
                                        </article>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                </main>
            </FundoPagina>
        </div>
    );
}

export default Instituicao;
