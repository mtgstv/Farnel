import { useState } from "react";

/*
 * Botão para ações que precisam de confirmação (cancelar, recusar, marcar como entregue):
 * ao clicar, ele vira uma pergunta com "Sim" e "Não" no mesmo lugar.
 */
function BotaoConfirmar({ texto, pergunta, className = "", onConfirmar }) {
    const [confirmando, setConfirmando] = useState(false);

    if (confirmando) {
        return (
            <div role="group" aria-label={pergunta} className="flex flex-1 flex-wrap items-center gap-2 rounded-2xl bg-cream px-3 py-2">
                <span className="flex-1 text-sm font-semibold text-ink">{pergunta}</span>
                <button type="button" onClick={onConfirmar} className="btn-primary btn-sm px-4 py-2">
                    Sim
                </button>
                <button type="button" onClick={() => setConfirmando(false)} className="btn-outline btn-sm px-4 py-2">
                    Não
                </button>
            </div>
        );
    }

    return (
        <button type="button" onClick={() => setConfirmando(true)} className={className}>
            {texto}
        </button>
    );
}

export default BotaoConfirmar;
