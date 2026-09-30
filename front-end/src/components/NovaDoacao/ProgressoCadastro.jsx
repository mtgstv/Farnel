import { CheckIcon } from "../Icons";

// Marcador de uma etapa: número enquanto falta algo, "✓" quando está completa.
function MarcadorEtapa({ numero, completa, claro = false }) {
    const cores = completa
        ? claro ? "bg-cream text-forest-dark" : "bg-forest text-white"
        : claro ? "border-2 border-cream/40 text-cream" : "border-2 border-line text-ink-soft";

    return (
        <span aria-hidden="true" className={`flex h-7 w-7 flex-none items-center justify-center rounded-full text-xs font-bold transition-colors ${cores}`}>
            {completa ? <CheckIcon className="h-4 w-4" /> : numero}
        </span>
    );
}

function textoEtapa(etapa) {
    return `${etapa.titulo}${etapa.completa ? " (completa)" : ""}`;
}

/*
 * Etapas na faixa verde do topo (atalhos para cada parte do formulário).
 * No celular é a única indicação de progresso, então rola na horizontal.
 */
export function EtapasFaixa({ etapas }) {
    return (
        <nav aria-label="Etapas do cadastro">
            <ol className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 md:mx-0 md:px-0">
                {etapas.map((etapa, i) => (
                    <li key={etapa.id} className="flex-none">
                        <a
                            href={`#${etapa.id}`}
                            aria-label={textoEtapa(etapa)}
                            className={`flex items-center gap-2.5 rounded-full py-1.5 pl-1.5 pr-4 text-sm font-semibold transition ${etapa.completa ? "bg-white/15 text-cream" : "bg-white/5 text-cream/90 hover:bg-white/10"}`}
                        >
                            <MarcadorEtapa numero={i + 1} completa={etapa.completa} claro />
                            {etapa.titulo}
                        </a>
                    </li>
                ))}
            </ol>
        </nav>
    );
}

// Cartão lateral com a barra de progresso e um atalho para a próxima etapa que falta.
export function ProgressoCadastro({ etapas, preenchidos, total }) {
    const porcentagem = Math.round((preenchidos / total) * 100);
    const proxima = etapas.find((etapa) => !etapa.completa);

    return (
        <section aria-labelledby="progresso-titulo" className="cartao p-6">
            <div className="flex items-baseline justify-between gap-3">
                <h2 id="progresso-titulo" className="text-lg font-semibold">Seu progresso</h2>
                <span className="text-sm font-semibold tabular-nums text-forest-dark">{porcentagem}%</span>
            </div>

            <div
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={total}
                aria-valuenow={preenchidos}
                aria-label="Informações obrigatórias preenchidas"
                className="mt-3 h-2 overflow-hidden rounded-full bg-cream-dark"
            >
                <div className="h-full rounded-full bg-forest transition-[width] duration-500" style={{ width: `${porcentagem}%` }} />
            </div>

            <p className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-ink-soft">
                {preenchidos} de {total} informações obrigatórias
                {proxima ? (
                    <a href={`#${proxima.id}`} className="font-semibold text-forest-dark hover:underline">
                        Próxima: {proxima.titulo} →
                    </a>
                ) : (
                    <span className="inline-flex items-center gap-1 font-semibold text-forest-dark">
                        <CheckIcon className="h-3.5 w-3.5" /> Tudo pronto para publicar
                    </span>
                )}
            </p>
        </section>
    );
}
