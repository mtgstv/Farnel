/*
 * Peças dos painéis ("Meu painel" e o painel administrativo).
 * Os gráficos são barras de uma cor só: o nome e o número de cada barra ficam escritos ao lado dela,
 * então a cor não carrega significado e a leitura não depende de enxergar cores.
 */

// Número de destaque com rótulo
export function Destaque({ valor, rotulo, detalhe }) {
    return (
        <div className="rounded-2xl bg-white px-5 py-6 shadow-card ring-1 ring-forest/5">
            <p className="font-heading text-3xl font-semibold text-forest-dark">{valor}</p>
            <p className="mt-1 text-sm font-semibold text-ink">{rotulo}</p>
            {detalhe && <p className="mt-0.5 text-xs text-ink-soft">{detalhe}</p>}
        </div>
    );
}

// Barras horizontais, todas na mesma escala (a maior ocupa a largura toda), com o valor na ponta.
// itens: [{ rotulo, total }]
export function GraficoBarras({ titulo, descricao, itens, vazio }) {
    const maior = Math.max(0, ...itens.map((item) => item.total));

    return (
        <section className="cartao p-6 sm:p-7">
            <h2 className="text-lg font-semibold">{titulo}</h2>
            {descricao && <p className="mt-1 text-sm text-ink-soft">{descricao}</p>}

            {maior === 0 ? (
                <p className="mt-5 rounded-xl bg-cream px-4 py-3 text-sm text-ink-soft">{vazio}</p>
            ) : (
                <ul className="mt-5 flex flex-col gap-3">
                    {itens.map(({ rotulo, total }) => (
                        <li
                            key={rotulo}
                            title={`${rotulo}: ${total}`}
                            className="grid grid-cols-[minmax(6rem,8.5rem)_1fr] items-center gap-3 text-sm"
                        >
                            <span className="truncate font-medium text-ink">{rotulo}</span>
                            <span className="flex items-center gap-2">
                                {total > 0 && (
                                    <span
                                        aria-hidden="true"
                                        // 85% da largura no máximo, para o número caber na ponta
                                        style={{ width: `${(total / maior) * 85}%` }}
                                        className="h-3 min-w-1 rounded-r bg-forest"
                                    />
                                )}
                                <span className="font-semibold tabular-nums text-ink">{total}</span>
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

// Quanto já foi entregue, por unidade (kg e pacotes não podem dividir o mesmo gráfico)
// entregue: [{ unidade, total }]
export function TotaisEntregues({ titulo, descricao, entregue, vazio }) {
    return (
        <section className="cartao p-6 sm:p-7">
            <h2 className="text-lg font-semibold">{titulo}</h2>
            {descricao && <p className="mt-1 text-sm text-ink-soft">{descricao}</p>}
            {entregue.length === 0 ? (
                <p className="mt-5 rounded-xl bg-cream px-4 py-3 text-sm text-ink-soft">{vazio}</p>
            ) : (
                <ul className="mt-5 flex flex-wrap gap-3">
                    {entregue.map(({ unidade, total }) => (
                        <li key={unidade} className="rounded-2xl bg-cream px-4 py-3">
                            <span className="font-heading text-2xl font-semibold text-forest-dark">
                                {Number(total).toLocaleString("pt-BR")}
                            </span>{" "}
                            <span className="text-sm font-medium text-ink">{unidade}</span>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
