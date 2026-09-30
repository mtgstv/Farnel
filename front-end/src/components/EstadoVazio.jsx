/*
 * Mensagem para listas vazias ("nenhuma doação ainda", "nenhum resultado"...).
 * - destaque (padrão): cartão com título, texto e uma ação (ex.: botão para cadastrar)
 * - simples: faixa discreta, para "nenhum resultado com esses filtros"
 */
function EstadoVazio({ eyebrow, titulo, texto, acao, simples = false }) {
    if (simples) {
        return (
            <div className="cartao p-8 text-center">
                <p className="font-semibold text-forest-dark">{titulo}</p>
                {texto && <p className="mt-1 text-sm text-ink-soft">{texto}</p>}
                {acao && <div className="mt-4">{acao}</div>}
            </div>
        );
    }

    return (
        <div className="cartao mx-auto max-w-lg p-8 text-center md:p-10">
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            <h2 className="mt-3 text-2xl font-semibold">{titulo}</h2>
            {texto && <p className="mt-3 text-sm leading-relaxed text-ink-soft">{texto}</p>}
            {acao && <div className="mt-6">{acao}</div>}
        </div>
    );
}

export default EstadoVazio;
