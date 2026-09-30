import { useState } from "react";

/*
 * Diz se o mouse está na faixa esquerda ou direita de um elemento
 * (usado para mostrar as setas ‹ › só quando o mouse chega nas laterais).
 * Retorna o lado ("esquerda" | "direita" | null) e os eventos para espalhar no elemento.
 */
export function useLadoDoMouse(zona = 0.18) {
    const [lado, setLado] = useState(null);

    function onMouseMove(event) {
        const area = event.currentTarget.getBoundingClientRect();
        const posicao = (event.clientX - area.left) / area.width;
        setLado(posicao < zona ? "esquerda" : posicao > 1 - zona ? "direita" : null);
    }

    function onMouseLeave() {
        setLado(null);
    }

    return [lado, { onMouseMove, onMouseLeave }];
}
