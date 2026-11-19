import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useFavoritos } from "../../hooks/useFavoritos";
import { STATUS_ENCERRADOS, statusDaDoacao } from "../../services/ordenacaoDoacoes";

/*
 * Estado e regras do botão de favoritar uma doação.
 * - Os favoritos ficam na conta: quem não entrou vai para o login (e volta para esta página).
 * - Doações vencidas, concluídas ou canceladas não podem ser favoritadas
 *   (mas quem já tinha favoritado antes ainda consegue remover). A API confere a mesma regra.
 */
export function useFavorito(doacao) {
    const { usuario } = useAuth();
    const { ehFavorito, alternarFavorito } = useFavoritos();
    const navigate = useNavigate();
    const location = useLocation();

    const favoritado = ehFavorito(doacao.id);
    // "Vencida" é calculada pela validade; as outras vêm do status salvo.
    const status = statusDaDoacao(doacao);
    const bloqueado = STATUS_ENCERRADOS.includes(status) && !favoritado;

    function alternar() {
        if (!usuario) {
            navigate("/login", { state: { from: location } });
            return;
        }

        if (bloqueado) return;

        // Se a API recusar, o coração volta sozinho ao estado anterior (ver FavoritosProvider)
        alternarFavorito(doacao).catch(() => {});
    }

    return { status, favoritado, bloqueado, alternar };
}
