import { ehLista, lerJSON, salvarJSON } from "./armazenamento";
import { getDoacoes, saveDoacoes } from "./doacoesStorage";

export const CHAVE_SOLICITACOES = "solicitacoes";

// Pedidos que ainda "seguram" a doação para quem pediu.
const STATUS_ATIVOS = ["Pendente", "Aceita"];

export function getSolicitacoes() {
    return lerJSON(CHAVE_SOLICITACOES, [], ehLista);
}

function salvarSolicitacoes(solicitacoes) {
    return salvarJSON(CHAVE_SOLICITACOES, solicitacoes);
}

function alterarDoacao(doacaoId, alterar) {
    const doacoes = getDoacoes();
    const doacao = doacoes.find((item) => item.id === doacaoId);
    if (!doacao) return;

    alterar(doacao);
    saveDoacoes(doacoes);
}

/*
 * Mantém o status da doação coerente com os pedidos: com algum pedido pendente ou aceito
 * ela fica "Solicitada"; sem nenhum, volta a "Disponível". Concluídas e canceladas não mudam.
 */
function sincronizarStatusDaDoacao(doacaoId) {
    const temPedidoAtivo = getSolicitacoes().some(
        (solicitacao) => solicitacao.doacaoId === doacaoId && STATUS_ATIVOS.includes(solicitacao.status)
    );

    alterarDoacao(doacaoId, (doacao) => {
        if (doacao.status === "Concluída" || doacao.status === "Cancelada") return;
        doacao.status = temPedidoAtivo ? "Solicitada" : "Disponível";
    });
}

// Devolve true se salvou.
export function adicionarSolicitacao(solicitacao) {
    if (!salvarSolicitacoes([...getSolicitacoes(), solicitacao])) return false;
    sincronizarStatusDaDoacao(solicitacao.doacaoId);
    return true;
}

// Muda o status de um pedido. Marcar como "Concluída" (entregue) também conclui a doação.
export function alterarStatusSolicitacao(id, status) {
    const solicitacoes = getSolicitacoes();
    const solicitacao = solicitacoes.find((item) => item.id === id);
    if (!solicitacao) return;

    solicitacao.status = status;
    salvarSolicitacoes(solicitacoes);

    if (status === "Concluída") {
        encerrarDoacao(solicitacao.doacaoId, "Concluída", id);
    } else {
        sincronizarStatusDaDoacao(solicitacao.doacaoId);
    }
}

/*
 * Encerra a doação (Concluída ou Cancelada) e resolve os pedidos que ainda estavam em aberto:
 * ao concluir, o pedido entregue (se houver) fica "Concluída" e os demais "Recusada";
 * ao cancelar, todos os pedidos em aberto ficam "Cancelada".
 */
export function encerrarDoacao(doacaoId, status, solicitacaoEntregue = null) {
    const solicitacoes = getSolicitacoes();

    for (const solicitacao of solicitacoes) {
        if (solicitacao.doacaoId !== doacaoId || !STATUS_ATIVOS.includes(solicitacao.status)) continue;

        if (status === "Cancelada") solicitacao.status = "Cancelada";
        else solicitacao.status = solicitacao.id === solicitacaoEntregue ? "Concluída" : "Recusada";
    }

    salvarSolicitacoes(solicitacoes);
    alterarDoacao(doacaoId, (doacao) => {
        doacao.status = status;
    });
}

// Pedido em aberto que o usuário já fez para essa doação (para não pedir duas vezes).
export function pedidoEmAberto(doacaoId, usuarioId) {
    return getSolicitacoes().find(
        (solicitacao) =>
            solicitacao.doacaoId === doacaoId &&
            solicitacao.solicitanteId === usuarioId &&
            STATUS_ATIVOS.includes(solicitacao.status)
    ) ?? null;
}
