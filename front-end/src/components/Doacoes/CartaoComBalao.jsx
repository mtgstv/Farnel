import FotoDoacao from "./FotoDoacao";
import BotaoFavorito from "./BotaoFavorito";
import { useFavorito } from "./useFavorito";
import SeloStatus from "./SeloStatus";
import { ESTILOS_ENCERRADA } from "./estilosDoacao";
import { PinIcon } from "../Icons";
import { diasAteVencer, textoVencimento } from "../../services/ordenacaoDoacoes";

/*
 * Card do "Estas doações vencem primeiro": foto grande em destaque e, sobreposto à parte
 * de baixo dela, um balão com o prazo e a descrição da doação.
 */
function CartaoComBalao({ doacao, onVerDetalhes }) {
    const favorito = useFavorito(doacao);
    const { status } = favorito;
    const dias = diasAteVencer(doacao.validade);

    return (
        <article className={`flex h-full w-full flex-col ${ESTILOS_ENCERRADA[status] ?? ""}`}>
            <div className="relative aspect-[16/10] w-full flex-none overflow-hidden rounded-3xl shadow-card">
                <button
                    type="button"
                    tabIndex={-1}
                    aria-hidden="true"
                    onClick={() => onVerDetalhes(doacao)}
                    className="group block h-full w-full"
                >
                    <FotoDoacao doacao={doacao} className="h-full w-full transition-transform duration-500 group-hover:scale-105" />
                </button>

                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-forest-dark">
                    {doacao.categoria}
                </span>
                <BotaoFavorito {...favorito} className="absolute right-3 top-3" />
            </div>

            {/* balão sobreposto à parte de baixo da foto */}
            <div className="relative z-10 mx-auto -mt-8 w-[92%] flex-1 rounded-2xl bg-white p-4 shadow-[0_14px_30px_-16px_rgba(42,42,36,0.35)] ring-1 ring-forest/5">
                <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-white ${dias <= 3 ? "bg-terracotta" : "bg-forest"}`}>
                        {textoVencimento(dias)}
                    </span>
                    {status !== "Disponível" && (
                        <SeloStatus status={status} />
                    )}
                </div>

                <button
                    type="button"
                    onClick={() => onVerDetalhes(doacao)}
                    title={doacao.titulo}
                    className="mt-2 block w-full text-left font-heading text-lg font-semibold text-forest-dark hover:underline"
                >
                    <span className="block truncate">{doacao.titulo}</span>
                </button>

                <p className="mt-1 line-clamp-2 text-sm leading-snug text-ink-soft">
                    {doacao.descricao || "Sem descrição."}
                </p>

                <p className="mt-2 flex items-center gap-1 truncate text-xs font-medium text-ink">
                    <PinIcon className="h-3.5 w-3.5 flex-none text-terracotta" />
                    {doacao.quantidade} · {doacao.local}
                </p>
            </div>
        </article>
    );
}

export default CartaoComBalao;
