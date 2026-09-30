import { useEffect, useState } from "react";
import { EVENTO_SESSAO_ALTERADA, getUsuarioLogado } from "../services/authStorage";

// Usuário logado (ou null), atualizado sempre que alguém entra, sai ou edita o perfil.
export function useUsuarioLogado() {
    const [usuario, setUsuario] = useState(getUsuarioLogado);

    useEffect(() => {
        function atualizar() {
            setUsuario(getUsuarioLogado());
        }

        window.addEventListener(EVENTO_SESSAO_ALTERADA, atualizar);
        // "storage" dispara quando a sessão muda em outra aba.
        window.addEventListener("storage", atualizar);
        return () => {
            window.removeEventListener(EVENTO_SESSAO_ALTERADA, atualizar);
            window.removeEventListener("storage", atualizar);
        };
    }, []);

    return usuario;
}
