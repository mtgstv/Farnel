import { ehObjeto, lerJSON, removerChave, salvarJSON } from "./armazenamento";

const CHAVE_USUARIO_LOGADO = "usuarioLogado";

// Avisado quando o usuário entra, sai ou atualiza o perfil (o header se atualiza sozinho).
export const EVENTO_SESSAO_ALTERADA = "sessao-alterada";

function avisarMudanca() {
    window.dispatchEvent(new Event(EVENTO_SESSAO_ALTERADA));
}

// Sessão corrompida conta como "ninguém logado".
export function getUsuarioLogado() {
    const usuario = lerJSON(CHAVE_USUARIO_LOGADO, null, ehObjeto);
    return usuario?.id ? usuario : null;
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

    salvarJSON(CHAVE_USUARIO_LOGADO, usuarioSeguro);
    avisarMudanca();
}

export function logout() {
    removerChave(CHAVE_USUARIO_LOGADO);
    avisarMudanca();
}
