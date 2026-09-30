import { useEffect, useState } from "react";

// Função de atualização do estado: anda "passo" posições (1 = próximo, -1 = anterior), em loop.
function andar(passo, total) {
    return ({ ativo }) => ({ ativo: (ativo + passo + total) % total, anterior: ativo });
}

/*
 * Controla um carrossel que troca sozinho:
 * - avança a cada "intervalo" ms;
 * - navegar(passo) anda manualmente e pausa a troca automática por "pausa" ms
 *   (cada clique reinicia a contagem);
 * - setMouseEmCima(true) pausa enquanto o mouse estiver sobre o carrossel (opcional).
 * "anterior" permite detectar o item que deu a volta, para ele não atravessar a tela animando.
 */
export function useCarrosselAutomatico(total, { intervalo = 4000, pausa = 8000 } = {}) {
    const [{ ativo, anterior }, setPosicao] = useState({ ativo: 0, anterior: 0 });
    const [pausas, setPausas] = useState(0); // > 0 enquanto pausado pelas setas
    const [mouseEmCima, setMouseEmCima] = useState(false);

    useEffect(() => {
        if (total < 2 || pausas > 0 || mouseEmCima) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const id = setInterval(() => setPosicao(andar(1, total)), intervalo);
        return () => clearInterval(id);
    }, [total, pausas, mouseEmCima, intervalo]);

    // Depois de um tempo sem usar as setas, a troca automática volta sozinha.
    useEffect(() => {
        if (pausas === 0) return;

        const retomar = setTimeout(() => setPausas(0), pausa);
        return () => clearTimeout(retomar);
    }, [pausas, pausa]);

    function navegar(passo) {
        setPosicao(andar(passo, total));
        setPausas((valor) => valor + 1);
    }

    // Protege contra a lista diminuir enquanto a página está aberta.
    return {
        ativo: ativo < total ? ativo : 0,
        anterior: anterior < total ? anterior : 0,
        navegar,
        setMouseEmCima,
    };
}
