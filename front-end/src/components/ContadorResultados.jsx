/*
 * "8 doações encontradas" ou "3 de 12 pedidos", com singular/plural corretos.
 * - total: quando informado, mostra "quantidade de total"
 * - masculino: para concordar "encontrado(s)" com palavras como "pedidos"
 */
function ContadorResultados({ quantidade, total, singular, plural, masculino = false }) {
    const referencia = total ?? quantidade;
    const palavra = referencia === 1 ? singular : plural;
    const encontrado = (masculino ? "encontrado" : "encontrada") + (quantidade === 1 ? "" : "s");

    return (
        <p className="mb-6 text-sm font-medium text-ink-soft" aria-live="polite">
            {total === undefined
                ? `${quantidade} ${palavra} ${encontrado}`
                : `${quantidade} de ${total} ${palavra}`}
        </p>
    );
}

export default ContadorResultados;
