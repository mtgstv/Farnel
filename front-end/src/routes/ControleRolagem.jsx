import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ESPERA_MAXIMA_MS = 3000;

/*
 * O React Router não mexe na rolagem ao trocar de página. Este componente:
 * - rola até o trecho indicado no link (ex.: /sobre#contato);
 * - ou volta ao topo quando a página muda.
 * As páginas carregam sob demanda: num link aberto direto (ou recarregado), o trecho
 * ainda não existe quando este efeito roda. Nesse caso, espera ele aparecer na tela.
 */
function ControleRolagem() {
    const { pathname, hash, key } = useLocation();

    useEffect(() => {
        if (!hash) {
            window.scrollTo(0, 0);
            return;
        }

        const id = decodeURIComponent(hash.slice(1));
        const rolarAteAlvo = () => {
            const alvo = document.getElementById(id);
            alvo?.scrollIntoView({ behavior: "smooth", block: "start" });
            return Boolean(alvo);
        };

        if (rolarAteAlvo()) return;

        window.scrollTo(0, 0);
        const observador = new MutationObserver(() => {
            if (rolarAteAlvo()) observador.disconnect();
        });
        observador.observe(document.body, { childList: true, subtree: true });
        const desistir = setTimeout(() => observador.disconnect(), ESPERA_MAXIMA_MS);

        return () => {
            observador.disconnect();
            clearTimeout(desistir);
        };
    }, [pathname, hash, key]);

    return null;
}

export default ControleRolagem;
