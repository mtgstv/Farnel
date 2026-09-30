import { useEffect, useState } from "react";
import {
    EVENTO_FAVORITOS_ALTERADOS,
    adicionarFavorito,
    isFavorito,
    removerFavorito,
} from "../../services/favoritosStorage";
import { STATUS_ENCERRADOS, statusDaDoacao } from "../../services/ordenacaoDoacoes";

/*
 * Estado e regras do botão de favoritar uma doação.
 * Doações vencidas, concluídas ou canceladas não podem ser favoritadas
 * (mas quem já tinha favoritado antes ainda consegue remover).
 */
export function useFavorito(doacao) {
    const [favoritado, setFavoritado] = useState(() => isFavorito(doacao.id));

    // Se o favorito mudar em outro card (ex.: outra cópia da mesma doação), atualiza este também.
    useEffect(() => {
        function sincronizar() {
            setFavoritado(isFavorito(doacao.id));
        }

        window.addEventListener(EVENTO_FAVORITOS_ALTERADOS, sincronizar);
        return () => window.removeEventListener(EVENTO_FAVORITOS_ALTERADOS, sincronizar);
    }, [doacao.id]);

    // "Vencida" é calculada pela validade; as outras vêm do status salvo.
    const status = statusDaDoacao(doacao);
    const bloqueado = STATUS_ENCERRADOS.includes(status) && !favoritado;

    function alternar() {
        if (favoritado) {
            removerFavorito(doacao.id);
            return;
        }

        if (bloqueado) return;

        adicionarFavorito(doacao);
    }

    return { status, favoritado, bloqueado, alternar };
}
