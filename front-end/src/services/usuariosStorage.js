const CHAVE_USUARIOS = "usuarios";

export function getUsuarios() {
    const dadosSalvos = localStorage.getItem(CHAVE_USUARIOS);

    if (dadosSalvos) {
        return JSON.parse(dadosSalvos);
    }

    localStorage.setItem(CHAVE_USUARIOS, JSON.stringify([]));

    return [];
}

export function saveUsuarios(usuarios) {
    localStorage.setItem(
        CHAVE_USUARIOS,
        JSON.stringify(usuarios)
    );
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

// Junta as alterações ao cadastro do usuário e devolve o cadastro atualizado.
export function atualizarUsuario(id, alteracoes) {
    const usuarios = getUsuarios();
    const indice = usuarios.findIndex((usuario) => usuario.id === id);
    if (indice === -1) return null;

    usuarios[indice] = { ...usuarios[indice], ...alteracoes };
    saveUsuarios(usuarios);

    return usuarios[indice];
}
