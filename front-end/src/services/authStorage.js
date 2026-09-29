const CHAVE_USUARIO_LOGADO = "usuarioLogado";

export function getUsuarioLogado() {
    const dadosSalvos = localStorage.getItem(CHAVE_USUARIO_LOGADO);

    if (!dadosSalvos) {
        return null;
    }

    return JSON.parse(dadosSalvos);
}

export function loginAutomatico(usuario) {
    const usuarioSeguro = {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
    };

    localStorage.setItem(
        CHAVE_USUARIO_LOGADO,
        JSON.stringify(usuarioSeguro)
    );
}

export function logout() {
    localStorage.removeItem(CHAVE_USUARIO_LOGADO);
}