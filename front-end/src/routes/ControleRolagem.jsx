import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/*
 * O React Router não mexe na rolagem ao trocar de página. Este componente:
 * - rola até o trecho indicado no link (ex.: /sobre#contato);
 * - ou volta ao topo quando a página muda.
 */
function ControleRolagem() {
    const { pathname, hash, key } = useLocation();

    useEffect(() => {
        if (hash) {
            const alvo = document.getElementById(decodeURIComponent(hash.slice(1)));

            if (alvo) {
                alvo.scrollIntoView({ behavior: "smooth", block: "start" });
                return;
            }
        }

        window.scrollTo(0, 0);
    }, [pathname, hash, key]);

    return null;
}

export default ControleRolagem;
