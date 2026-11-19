import { requisicao } from "./api";
import { paraTela } from "./doacoesService";

// Favoritos de quem está logado (as rotas /me exigem login)

export async function listarFavoritos() {
    const doacoes = await requisicao("/me/favoritos");
    return doacoes.map(paraTela);
}

export function adicionarFavorito(doacaoId) {
    return requisicao(`/me/favoritos/${doacaoId}`, { method: "PUT" });
}

export function removerFavorito(doacaoId) {
    return requisicao(`/me/favoritos/${doacaoId}`, { method: "DELETE" });
}
