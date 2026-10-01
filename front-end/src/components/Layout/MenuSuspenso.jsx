import { useRef } from "react";
import { Link } from "react-router-dom";

export function Seta({ aberto }) {
    return (
        <svg
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
            className={`h-4 w-4 transition-transform duration-200 ${aberto ? "rotate-180" : ""}`}
        >
            <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

/*
 * Botão que abre uma lista de links (padrão "disclosure" de navegação).
 * O Header controla qual menu está aberto, para que só um fique aberto por vez.
 * - itens: [{ rotulo, descricao?, para }]
 * - rodape: conteúdo extra no fim do menu (ex.: botão "Sair")
 * - rotuloAcessivel: nome lido por leitores de tela, quando o rótulo não é só texto
 */
function MenuSuspenso({ id, rotulo, rotuloAcessivel, itens, aberto, ativo, onAlternar, onFechar, alinhamento = "esquerda", rodape }) {
    const botaoRef = useRef(null);

    function handleKeyDown(event) {
        if (event.key === "Escape" && aberto) {
            onFechar();
            botaoRef.current?.focus();
        }
    }

    // Fecha quando o foco sai do menu (ex.: navegando com Tab).
    function handleBlur(event) {
        if (aberto && !event.currentTarget.contains(event.relatedTarget)) {
            onFechar();
        }
    }

    return (
        <div className="relative" onKeyDown={handleKeyDown} onBlur={handleBlur}>
            <button
                ref={botaoRef}
                type="button"
                onClick={onAlternar}
                aria-label={rotuloAcessivel}
                aria-expanded={aberto}
                aria-controls={`menu-${id}`}
                className={`flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium transition-colors hover:bg-cream-dark hover:text-forest-dark ${ativo || aberto ? "text-forest-dark" : "text-ink-soft"}`}
            >
                {rotulo}
                <Seta aberto={aberto} />
            </button>

            {aberto && (
                <div
                    id={`menu-${id}`}
                    className={`absolute top-full z-50 mt-2 w-72 rounded-2xl bg-white p-2 shadow-card ring-1 ring-forest/10 ${alinhamento === "direita" ? "right-0" : "left-0"}`}
                >
                    <ul>
                        {itens.map((item) => (
                            <li key={item.para}>
                                <Link
                                    to={item.para}
                                    onClick={onFechar}
                                    className="block rounded-xl px-3 py-2.5 transition-colors hover:bg-cream focus-visible:bg-cream"
                                >
                                    <span className="block text-sm font-semibold text-forest-dark">{item.rotulo}</span>
                                    {item.descricao && (
                                        <span className="mt-0.5 block text-xs text-ink-soft">{item.descricao}</span>
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {rodape && <div className="mt-1 border-t border-line pt-1">{rodape}</div>}
                </div>
            )}
        </div>
    );
}

export default MenuSuspenso;
