import FotoDoacao from "./FotoDoacao";
import BotaoFavorito from "./BotaoFavorito";
import { useFavorito } from "./useFavorito";
import SeloStatus from "./SeloStatus";
import { ESTILOS_ENCERRADA } from "./estilosDoacao";
import { diasAteVencer, textoVencimento } from "../../services/ordenacaoDoacoes";

// Linha de rodapé: prazo para as ativas/vencidas; data de validade para as encerradas.
function textoValidade(doacao, status) {
    if (!doacao.validade) return "Sem validade informada";
    if (status === "Concluída" || status === "Cancelada") return `Validade: ${doacao.validade}`;
    return textoVencimento(diasAteVencer(doacao.validade));
}

// Versão menor do card de doação, usada nas fileiras por categoria.
function CartaoCompacto({ doacao, onVerDetalhes }) {
    const favorito = useFavorito(doacao);
    const { status } = favorito;
    const dias = doacao.validade ? diasAteVencer(doacao.validade) : null;
    const urgente = (status === "Disponível" || status === "Solicitada") && dias !== null && dias <= 3;

    return (
        <article className={`relative flex h-full w-full flex-col overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-forest/5 transition-[opacity,filter] ${ESTILOS_ENCERRADA[status] ?? ""}`}>
            <button
                type="button"
                tabIndex={-1}
                aria-hidden="true"
                onClick={() => onVerDetalhes(doacao)}
                className="group relative block h-36 w-full flex-none overflow-hidden"
            >
                <FotoDoacao doacao={doacao} className="h-full w-full transition-transform duration-500 group-hover:scale-105" />
                <SeloStatus status={status} sobreFoto className="absolute left-2.5 top-2.5" />
            </button>

            <BotaoFavorito {...favorito} className="absolute right-2.5 top-2.5" />

            <div className="flex flex-1 flex-col p-4">
                <button
                    type="button"
                    onClick={() => onVerDetalhes(doacao)}
                    title={doacao.titulo}
                    className="text-left font-heading text-lg font-semibold text-forest-dark hover:underline"
                >
                    <span className="block truncate">{doacao.titulo}</span>
                </button>

                <p className="mt-1 truncate text-xs text-ink-soft">
                    {doacao.quantidade} · {doacao.local}
                </p>

                <p className={`mt-auto text-xs font-semibold ${urgente ? "text-terracotta-dark" : "text-ink-soft"}`}>
                    {textoValidade(doacao, status)}
                </p>
            </div>
        </article>
    );
}

export default CartaoCompacto;
