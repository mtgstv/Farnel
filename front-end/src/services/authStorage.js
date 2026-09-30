const CHAVE_USUARIO_LOGADO = "usuarioLogado";

// Avisado quando o usuário entra, sai ou atualiza o perfil (o header se atualiza sozinho).
export const EVENTO_SESSAO_ALTERADA = "sessao-alterada";

function avisarMudanca() {
    window.dispatchEvent(new Event(EVENTO_SESSAO_ALTERADA));
}

export function getUsuarioLogado() {
    const dadosSalvos = localStorage.getItem(CHAVE_USUARIO_LOGADO);

    if (!dadosSalvos) {
        return null;
    }

    return JSON.parse(dadosSalvos);
}

// Guarda na sessão só o necessário (nunca a senha). Também usado depois de editar o perfil.
export function loginAutomatico(usuario) {
    const usuarioSeguro = {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        // Usuários cadastrados antes do campo "tipo" existir são tratados como doadores.
        tipo: usuario.tipo ?? "doador",
        foto: usuario.foto ?? null,
    };

    localStorage.setItem(
        CHAVE_USUARIO_LOGADO,
        JSON.stringify(usuarioSeguro)
    );
    avisarMudanca();
}

export function logout() {
    localStorage.removeItem(CHAVE_USUARIO_LOGADO);
    avisarMudanca();
}
