import { requisicao } from "./api";
import { paraDataBR } from "./formatacao";

/*
 * A API separa quantidade e unidade, cidade e UF, e usa datas no formato aaaa-mm-dd.
 * As telas (feitas na AV1) usam "40 pacotes", "Campinas/SP" e "dd/mm/aaaa".
 * Esta conversão deixa a doação da API no formato das telas, para os componentes continuarem iguais.
 */
export function paraTela(doacao) {
    return {
        ...doacao,
        quantidade: `${Number(doacao.quantidade)} ${doacao.unidade}`,
        validade: paraDataBR(doacao.validade),
        dataCadastro: new Date(doacao.criadoEm).toLocaleDateString("pt-BR"),
        local: `${doacao.cidade}/${doacao.uf}`,
    };
}

// Todas as doações (o telefone do doador só vem para quem está logado)
export async function listarDoacoes() {
    const doacoes = await requisicao("/doacoes");
    return doacoes.map(paraTela);
}

export async function buscarDoacao(id) {
    return paraTela(await requisicao(`/doacoes/${id}`));
}

// As doações de quem está logado
export async function listarMinhasDoacoes() {
    const doacoes = await requisicao("/me/doacoes");
    return doacoes.map(paraTela);
}

// dados: os campos do formulário de nova doação (ver pages/Doacoes/NovaDoacao.jsx)
export async function cadastrarDoacao(dados) {
    return paraTela(await requisicao("/doacoes", { method: "POST", corpo: dados }));
}

// status: "Concluída" (entregue) ou "Cancelada"
export async function encerrarDoacao(id, status) {
    return paraTela(await requisicao(`/doacoes/${id}/status`, { method: "PATCH", corpo: { status } }));
}
