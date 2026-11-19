import { requisicao } from "./api";
import { comTipo } from "./authService";

// Perfil da pessoa logada (as rotas /me exigem login)

// A conta como está agora no banco (ex.: para saber se a instituição já foi verificada)
export async function buscarMinhaConta() {
    return comTipo(await requisicao("/me"));
}

// dados: o formulário inteiro de "Meu perfil". Devolve a conta atualizada.
export async function atualizarPerfil(dados) {
    return comTipo(await requisicao("/me", { method: "PUT", corpo: dados }));
}

// { senhaAtual, novaSenha }. A API confere a senha atual antes de trocar.
export function trocarSenha(dados) {
    return requisicao("/me/senha", { method: "PATCH", corpo: dados });
}
