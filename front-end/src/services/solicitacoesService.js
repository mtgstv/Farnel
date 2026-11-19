import { requisicao } from "./api";
import { paraTela as doacaoParaTela } from "./doacoesService";
import { paraDataBR } from "./formatacao";

/*
 * Converte um pedido da API para o formato que as telas (feitas na AV1) já usavam:
 * datas em dd/mm/aaaa, a doação no formato das telas e os atalhos doacaoTitulo/doadorNome/solicitanteNome.
 */
export function paraTela(solicitacao) {
    const doacao = doacaoParaTela(solicitacao.doacao);

    return {
        ...solicitacao,
        doacao,
        doacaoId: doacao.id,
        doacaoTitulo: doacao.titulo,
        doadorNome: doacao.doador,
        solicitanteNome: solicitacao.nome,
        dataRetirada: paraDataBR(solicitacao.dataRetirada),
        dataCriacao: new Date(solicitacao.criadoEm).toLocaleDateString("pt-BR"),
    };
}

// dados: os campos do formulário de nova solicitação (ver pages/Doacoes/NovaSolicitacao.jsx)
export async function solicitarDoacao(dados) {
    return paraTela(await requisicao("/solicitacoes", { method: "POST", corpo: dados }));
}

// Pedidos que a pessoa logada fez
export async function listarSolicitacoesFeitas() {
    const lista = await requisicao("/me/solicitacoes/feitas");
    return lista.map(paraTela);
}

// Pedidos recebidos nas doações da pessoa logada
export async function listarSolicitacoesRecebidas() {
    const lista = await requisicao("/me/solicitacoes/recebidas");
    return lista.map(paraTela);
}

// As duas listas da página Solicitações, buscadas ao mesmo tempo
export async function listarSolicitacoes() {
    const [feitas, recebidas] = await Promise.all([listarSolicitacoesFeitas(), listarSolicitacoesRecebidas()]);
    return { feitas, recebidas };
}

// status: "Aceita", "Recusada", "Concluída" (entregue) ou "Cancelada"
export async function alterarStatusSolicitacao(id, status) {
    return paraTela(await requisicao(`/solicitacoes/${id}/status`, { method: "PATCH", corpo: { status } }));
}
