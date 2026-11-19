import { renovarSessao as renovar, requisicao } from "./api";

/*
 * Login pela API. Os tokens chegam em cookies HttpOnly (o JavaScript não consegue lê-los);
 * aqui só recebemos os dados da conta e do perfil: { id, nome, email, papel, criadoEm, telefone, cidade... }.
 * "tipo" é o nome que as telas da AV1 já usavam para o papel (ex.: RotaAdmin).
 */
export function comTipo(usuario) {
    return usuario ? { ...usuario, tipo: usuario.papel === "ADMIN" ? "admin" : "doador" } : null;
}

export async function cadastrarUsuario(dados) {
    return comTipo(await requisicao("/auth/cadastro", { method: "POST", corpo: dados }));
}

export async function loginUsuario(dados) {
    return comTipo(await requisicao("/auth/login", { method: "POST", corpo: dados }));
}

// Ao abrir o site: descobre se este navegador tem um login salvo (null se não tiver)
export async function renovarSessao() {
    return comTipo(await renovar());
}

export function fazerLogout() {
    return requisicao("/auth/logout", { method: "POST" });
}
