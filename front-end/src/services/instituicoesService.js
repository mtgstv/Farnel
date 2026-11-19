import { requisicao } from "./api";

// Instituições verificadas (lista pública): { id, nome, cidade, uf, sobre, foto, doacoesRecebidas }
export function listarInstituicoes() {
    return requisicao("/instituicoes");
}

// Uma instituição é a conta que participa como "ONG ou instituição" (escolhido no perfil)
export function ehInstituicao(usuario) {
    return usuario?.perfil === "ONG ou instituição";
}
