import { useCallback, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import FotoDoacao from "../../components/Doacoes/FotoDoacao";
import SeloStatus from "../../components/Doacoes/SeloStatus";
import { useFavorito } from "../../components/Doacoes/useFavorito";
import EstadoVazio from "../../components/Comuns/EstadoVazio";
import InfoItem from "../../components/Comuns/InfoItem";
import { Carregando, ErroAoCarregar } from "../../components/Comuns/EstadoRequisicao";
import { ArrowIcon, CheckBadge, PinIcon } from "../../components/Comuns/Icons";
import { useCarregar } from "../../hooks/useCarregar";
import { useUsuarioLogado } from "../../hooks/useUsuarioLogado";
import { buscarDoacao } from "../../services/doacoesService";
import { diasAteVencer, ehExemplo, podeSerSolicitada, textoVencimento } from "../../services/ordenacaoDoacoes";

// Por que a doação não pode ser solicitada, conforme o status.
const MOTIVO_INDISPONIVEL = {
    Solicitada: "Esta doação já tem um pedido em andamento. Se ele for cancelado, ela volta a ficar disponível.",
    Vencida: "O prazo de validade desta doação já passou, por isso ela não pode mais ser solicitada.",
    Concluída: "Esta doação já foi entregue. Obrigado a todos que participaram!",
    Cancelada: "Esta doação foi cancelada pelo doador.",
};

// Confirmação mostrada ao chegar aqui logo depois de cadastrar a doação.
function AvisoPublicada() {
    const [visivel, setVisivel] = useState(true);
    if (!visivel) return null;

    return (
        <div role="status" className="mt-6 flex items-start gap-3 rounded-2xl bg-forest px-5 py-4 text-cream shadow-card">
            <CheckBadge className="mt-0.5 h-6 w-6 flex-none text-terracotta-light" />
            <div className="flex-1 text-sm">
                <p className="font-semibold">Doação publicada! Obrigado por ajudar.</p>
                <p className="mt-0.5 text-cream/90">
                    Ela já aparece para quem procura alimentos na sua região. Acompanhe os pedidos em{" "}
                    <Link to="/solicitacoes?aba=recebidas" className="font-semibold underline">Solicitações</Link>.
                </p>
            </div>
            <button
                type="button"
                onClick={() => setVisivel(false)}
                aria-label="Fechar aviso"
                className="flex-none rounded-full px-2 text-lg leading-none text-cream/90 hover:bg-white/10"
            >
                ×
            </button>
        </div>
    );
}

function CartaoSecao({ titulo, children }) {
    return (
        <section className="cartao p-6 sm:p-7">
            <h2 className="text-lg font-semibold">{titulo}</h2>
            <div className="mt-4">{children}</div>
        </section>
    );
}

function DetalhesDoacao() {
    const { id } = useParams();
    const usuario = useUsuarioLogado();
    const buscar = useCallback(() => buscarDoacao(id), [id]);
    // Busca de novo quando alguém entra ou sai (o telefone do doador só vem para quem está logado)
    const { dados: doacao, erro, recarregar } = useCarregar(buscar, usuario?.id ?? null);

    // 404: não existe; 400: o endereço não tem um número no fim
    if (erro?.status === 404 || erro?.status === 400) {
        return (
            <main className="container-page min-h-[60vh] py-16">
                <EstadoVazio
                    eyebrow="Doação não encontrada"
                    titulo="Não encontramos esta doação"
                    tituloDaPagina
                    texto="Ela pode ter sido removida, ou o endereço está incorreto."
                    acao={<Link to="/doacoes" className="btn-primary">Ver doações disponíveis</Link>}
                />
            </main>
        );
    }

    if (erro) {
        return (
            <main className="container-page min-h-[60vh] py-16">
                <ErroAoCarregar erro={erro} onTentarNovamente={recarregar} titulo="Não foi possível carregar a doação" />
            </main>
        );
    }

    // Ao trocar de doação, mostra o carregando em vez da doação anterior
    if (!doacao || doacao.id !== Number(id)) {
        return (
            <main className="container-page">
                <Carregando texto="Carregando doação..." />
            </main>
        );
    }

    return <Detalhes doacao={doacao} usuario={usuario} />;
}

// Separado para os hooks (useFavorito) só rodarem quando a doação existe.
function Detalhes({ doacao, usuario }) {
    const { status, favoritado, bloqueado, alternar } = useFavorito(doacao);
    const location = useLocation();
    const minhaDoacao = Boolean(usuario) && doacao.usuarioId === usuario.id;
    const podeSolicitar = podeSerSolicitada(doacao, usuario);
    const dias = doacao.validade ? diasAteVencer(doacao.validade) : null;
    const ativa = status === "Disponível" || status === "Solicitada";
    const acabouDePublicar = location.state?.publicada === true;

    return (
        <main className="bg-cream pb-16 pt-8 md:pb-20">
            <div className="container-page">
                <Link to="/doacoes" className="inline-flex items-center gap-2 text-sm font-semibold text-forest-dark hover:underline">
                    <ArrowIcon className="h-4 w-4 rotate-180" />
                    Todas as doações
                </Link>

                {acabouDePublicar && <AvisoPublicada />}

                <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:items-start">
                    <div className="relative overflow-hidden rounded-3xl shadow-card">
                        <FotoDoacao doacao={doacao} prioritaria className="aspect-[4/3] w-full" />
                        <SeloStatus status={status} sobreFoto className="absolute left-4 top-4" />
                    </div>

                    <div className="cartao flex flex-col p-6 sm:p-8">
                        <p className="rotulo-categoria">{doacao.categoria}</p>
                        <h1 className="mt-2 text-3xl font-semibold md:text-4xl">{doacao.titulo}</h1>

                        {dias !== null && (
                            <p className={`mt-3 text-sm font-semibold ${ativa && dias <= 3 ? "text-terracotta-dark" : "text-ink-soft"}`}>
                                {ativa || status === "Vencida" ? textoVencimento(dias) : `Validade: ${doacao.validade}`}
                            </p>
                        )}

                        {doacao.descricao && (
                            <p className="mt-4 leading-relaxed text-ink-soft">{doacao.descricao}</p>
                        )}

                        <dl className="mt-6 grid grid-cols-2 gap-4 rounded-2xl bg-cream p-4">
                            <InfoItem rotulo="Quantidade">{doacao.quantidade}</InfoItem>
                            <InfoItem rotulo="Validade">{doacao.validade}</InfoItem>
                            {doacao.conservacao && <InfoItem rotulo="Conservação">{doacao.conservacao}</InfoItem>}
                            <InfoItem rotulo="Cadastrada em">{doacao.dataCadastro}</InfoItem>
                        </dl>

                        {doacao.alergenicos?.length > 0 && (
                            <div className="mt-5">
                                <p className="text-xs font-semibold uppercase tracking-wider text-ink-soft">Contém</p>
                                <ul className="mt-2 flex flex-wrap gap-2">
                                    {doacao.alergenicos.map((alergenico) => (
                                        <li key={alergenico} className="rounded-full bg-terracotta/10 px-3 py-1 text-xs font-semibold text-terracotta-dark">
                                            {alergenico}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="mt-6 flex flex-col gap-3 border-t border-line pt-6">
                            {minhaDoacao && (
                                <p className="aviso-sucesso font-medium">
                                    Esta doação é sua.{" "}
                                    <Link to="/minhas-doacoes" className="underline">Ver no histórico</Link>
                                </p>
                            )}
                            {status === "Disponível" && ehExemplo(doacao) && (
                                <p className="rounded-xl bg-cream px-4 py-3 text-sm text-ink-soft">
                                    Esta é uma doação de demonstração, sem um doador cadastrado por trás, por isso não pode ser solicitada.
                                </p>
                            )}
                            {!minhaDoacao && MOTIVO_INDISPONIVEL[status] && (
                                <p className="rounded-xl bg-cream px-4 py-3 text-sm text-ink-soft">{MOTIVO_INDISPONIVEL[status]}</p>
                            )}

                            <div className="flex flex-col gap-3 sm:flex-row">
                                {podeSolicitar && (
                                    <Link to={`/solicitacoes/nova?doacao=${doacao.id}`} className="btn-primary sm:flex-1">
                                        Solicitar doação
                                        <ArrowIcon className="h-4 w-4" />
                                    </Link>
                                )}
                                {!minhaDoacao && (
                                    <button
                                        type="button"
                                        onClick={alternar}
                                        disabled={bloqueado}
                                        title={bloqueado ? `Doações com status "${status}" não podem ser favoritadas` : favoritado ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                                        className={`btn-secundario sm:flex-1 ${bloqueado ? "border-dashed line-through disabled:pointer-events-auto disabled:opacity-80" : ""}`}
                                    >
                                        {favoritado ? "♥ Nos favoritos" : "♡ Favoritar"}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                    <CartaoSecao titulo="Local e retirada">
                        <dl className="grid gap-4 sm:grid-cols-2">
                            <InfoItem rotulo="Cidade">
                                <span className="inline-flex items-center gap-1">
                                    <PinIcon className="h-4 w-4 text-terracotta" />
                                    {doacao.local}
                                </span>
                            </InfoItem>
                            <InfoItem rotulo="Forma de retirada">{doacao.tipoRetirada}</InfoItem>
                            {doacao.endereco && <InfoItem rotulo="Endereço" className="sm:col-span-2">{doacao.endereco}</InfoItem>}
                            {doacao.horario && <InfoItem rotulo="Horários" className="sm:col-span-2">{doacao.horario}</InfoItem>}
                        </dl>
                        {doacao.observacoes && (
                            <p className="mt-4 rounded-xl bg-cream px-4 py-3 text-sm text-ink-soft">
                                <span className="font-semibold text-ink">Observações:</span> {doacao.observacoes}
                            </p>
                        )}
                    </CartaoSecao>

                    <CartaoSecao titulo="Doador">
                        <div className="flex items-center gap-4">
                            <span aria-hidden="true" className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-forest/10 font-heading text-xl font-semibold text-forest-dark">
                                {doacao.doador?.charAt(0)}
                            </span>
                            <div>
                                <p className="font-semibold text-ink">{doacao.doador}</p>
                                {/* A API só envia o telefone para o próprio doador e para quem teve o pedido aceito */}
                                {doacao.contato ? (
                                    <p className="text-sm text-ink-soft">{doacao.contato}</p>
                                ) : usuario ? (
                                    <p className="text-sm text-ink-soft">O telefone aparece aqui quando o doador aceitar o seu pedido.</p>
                                ) : (
                                    <p className="text-sm text-ink-soft">
                                        <Link to="/login" state={{ from: location }} className="font-semibold text-forest-dark underline">
                                            Entre
                                        </Link>{" "}
                                        e peça a doação: o telefone aparece quando o doador aceitar.
                                    </p>
                                )}
                            </div>
                        </div>
                        <p className="mt-4 text-sm text-ink-soft">
                            Para retirar, envie uma solicitação: quando o doador aceitar, vocês combinam os detalhes.
                        </p>
                    </CartaoSecao>
                </div>
            </div>
        </main>
    );
}

export default DetalhesDoacao;
