import { Link } from "react-router-dom";

/*
 * Faixa verde do topo das páginas de listagem (doações, histórico, solicitações):
 * link de voltar, título e, abaixo, o que for passado em "children" (filtros, abas...).
 */
function FaixaTopo({ eyebrow, titulo, descricao, voltarPara = "/", textoVoltar = "Voltar para Home", acao, children }) {
    return (
        <section className="relative overflow-hidden bg-forest pb-10 pt-8 md:pb-12 md:pt-10">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full border-2 border-cream/10" />
                <div className="absolute -left-20 -bottom-28 h-64 w-64 rounded-full bg-forest-light/40 blur-2xl" />
                <div className="absolute right-1/4 -bottom-16 h-40 w-40 rounded-full bg-terracotta/20 blur-2xl" />
            </div>

            <div className="container-largo relative">
                <Link
                    to={voltarPara}
                    className="inline-flex items-center gap-2 rounded-full border-2 border-white/25 px-4 py-2 text-sm font-semibold text-cream transition hover:bg-white/10"
                >
                    ← {textoVoltar}
                </Link>

                <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        {eyebrow && <p className="eyebrow-claro">{eyebrow}</p>}
                        <h1 className="mt-2 text-3xl font-semibold text-cream md:text-4xl">{titulo}</h1>
                        {descricao && (
                            <p className="mt-2 max-w-xl text-sm text-cream/90 md:text-base">{descricao}</p>
                        )}
                    </div>

                    {acao && <div className="flex-none">{acao}</div>}
                </div>

                {children && <div className="mt-8">{children}</div>}
            </div>
        </section>
    );
}

export default FaixaTopo;
