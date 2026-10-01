// Peças dos formulários grandes (cadastrar doação, solicitar doação, perfil).

// Rótulo + campo + mensagem de erro/dica. "contador" aparece à direita do rótulo (ex.: "12/500").
export function Campo({ id, rotulo, erro, dica, contador, opcional = false, children }) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between gap-3">
                <label htmlFor={id} className="rotulo">
                    {rotulo}
                    {opcional && <span className="font-normal text-ink-soft"> (opcional)</span>}
                </label>
                {contador && <span className="text-xs tabular-nums text-ink-soft">{contador}</span>}
            </div>

            {children}

            {erro ? (
                <p id={`${id}-erro`} className="text-sm text-terracotta-dark">
                    {erro}
                </p>
            ) : (
                dica && <p className="text-xs text-ink-soft">{dica}</p>
            )}
        </div>
    );
}

// Bloco do formulário com título; "descricao" é um texto curto explicando o bloco.
export function Secao({ titulo, descricao, children }) {
    return (
        <fieldset className="flex flex-col gap-5 border-t border-line pt-8 first:border-t-0 first:pt-0">
            <legend className="mb-5 font-heading text-xl font-semibold text-forest-dark">
                {titulo}
                {descricao && (
                    <span className="mt-1 block font-sans text-sm font-normal text-ink-soft">{descricao}</span>
                )}
            </legend>
            {children}
        </fieldset>
    );
}
