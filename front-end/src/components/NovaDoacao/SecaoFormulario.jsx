import { CheckIcon } from "../Icons";

/*
 * Cartão de uma etapa do formulário: ícone, número da etapa, título e descrição.
 * Quando todos os campos obrigatórios da etapa estão ok, mostra o selo "Completo".
 */
function SecaoFormulario({ id, numero, total, icone: Icone, titulo, descricao, completa = false, children }) {
    return (
        <section id={id} aria-labelledby={`${id}-titulo`} className="cartao scroll-mt-24 p-6 sm:p-8">
            <header className="flex items-center gap-4">
                <span
                    aria-hidden="true"
                    className={`flex h-11 w-11 flex-none sm:h-12 sm:w-12 items-center justify-center rounded-2xl transition-colors ${completa ? "bg-forest text-white" : "bg-forest/10 text-forest-dark"}`}
                >
                    <Icone className="h-6 w-6" />
                </span>

                <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
                        Etapa {numero} de {total}
                    </p>
                    <h2 id={`${id}-titulo`} className="mt-0.5 text-xl font-semibold sm:text-2xl">{titulo}</h2>
                </div>

                {completa && (
                    <span className="hidden flex-none items-center gap-1 rounded-full bg-forest/10 px-3 py-1 text-xs font-semibold text-forest-dark sm:inline-flex">
                        <CheckIcon className="h-3.5 w-3.5" />
                        Completo
                    </span>
                )}
            </header>

            {descricao && <p className="mt-3 text-sm leading-relaxed text-ink-soft sm:pl-16">{descricao}</p>}

            <div className="mt-7 flex flex-col gap-6 border-t border-line pt-7">{children}</div>
        </section>
    );
}

export default SecaoFormulario;
