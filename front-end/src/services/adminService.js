import { requisicao } from "./api";
import { paraTela } from "./doacoesService";

// Área administrativa (/admin): a API só responde para contas com papel ADMIN (as outras recebem 403)

// Os números do site inteiro
export function buscarPainelGeral() {
    return requisicao("/admin/painel");
}

// Todas as doações, cada uma com quem a cadastrou: { doacao (no formato das telas), dono: { id, nome, email } }
export async function listarTodasAsDoacoes() {
    const lista = await requisicao("/admin/doacoes");
    return lista.map(({ doacao, dono }) => ({ ...paraTela(doacao), dono }));
}

// Moderação: cancela a doação (e os pedidos em aberto dela)
export async function cancelarDoacaoComoAdmin(id) {
    const { doacao, dono } = await requisicao(`/admin/doacoes/${id}/status`, { method: "PATCH", corpo: { status: "Cancelada" } });
    return { ...paraTela(doacao), dono };
}

export function listarUsuarios() {
    return requisicao("/admin/usuarios");
}

// papel: "ADMIN" ou "USUARIO"
export function alterarPapel(usuarioId, papel) {
    return requisicao(`/admin/usuarios/${usuarioId}/papel`, { method: "PATCH", corpo: { papel } });
}

// Todas as instituições, verificadas ou não: { id, nome, email, cidade, uf, sobre, verificada, doacoesRecebidas }
export function listarInstituicoesAdmin() {
    return requisicao("/admin/instituicoes");
}

export function alterarVerificacao(instituicaoId, verificada) {
    return requisicao(`/admin/instituicoes/${instituicaoId}/verificacao`, { method: "PATCH", corpo: { verificada } });
}
