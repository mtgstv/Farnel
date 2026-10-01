import { ehLista, lerJSON, salvarJSON } from "./armazenamento";

const CHAVE_USUARIOS = "usuarios";

export function getUsuarios() {
    return lerJSON(CHAVE_USUARIOS, [], ehLista);
}

// Devolve true se salvou.
export function saveUsuarios(usuarios) {
    return salvarJSON(CHAVE_USUARIOS, usuarios);
}

// Cadastro completo de um usuário (com os dados do perfil), ou null.
export function getUsuarioPorId(id) {
    return getUsuarios().find((usuario) => usuario.id === id) ?? null;
}

// true se outro usuário (diferente de "exceto") já usa esse e-mail.
export function emailEmUso(email, exceto) {
    const procurado = email.trim().toLowerCase();
    return getUsuarios().some(
        (usuario) => usuario.id !== exceto && usuario.email.toLowerCase() === procurado
    );
}

// Junta as alterações ao cadastro do usuário e devolve o cadastro atualizado (ou null, se não salvou).
export function atualizarUsuario(id, alteracoes) {
    const usuarios = getUsuarios();
    const indice = usuarios.findIndex((usuario) => usuario.id === id);
    if (indice === -1) return null;

    usuarios[indice] = { ...usuarios[indice], ...alteracoes };
    return saveUsuarios(usuarios) ? usuarios[indice] : null;
}
