import { doacoes } from "../data/content";
import { limparFavoritos } from "./favoritosStorage";

const CHAVE_DOACOES ="doacoes";

/*
 * Versão das doações de exemplo (data/content.js). Quando este número aumenta,
 * TODAS as doações salvas no navegador são apagadas e substituídas pelos exemplos,
 * e os favoritos e as solicitações são limpos (apontariam para doações que não existem mais).
 * Aumente só quando quiser recomeçar os dados do zero.
 */
const VERSAO_DADOS = 4;
const CHAVE_VERSAO_DADOS = "doacoesVersaoDados";

function dadosDesatualizados() {
    return Number(localStorage.getItem(CHAVE_VERSAO_DADOS)) < VERSAO_DADOS;
}

// Começa (ou recomeça) com as doações de exemplo.
function carregarExemplos() {
    saveDoacoes(doacoes);
    limparFavoritos();
    // As solicitações apontariam para doações que não existem mais. (Chave escrita aqui
    // em vez de importada de solicitacoesStorage, que já importa este arquivo.)
    localStorage.removeItem("solicitacoes");
    localStorage.setItem(CHAVE_VERSAO_DADOS, String(VERSAO_DADOS));
    localStorage.removeItem("doacoesVersaoExemplos"); // chave antiga, não é mais usada

    return JSON.parse(JSON.stringify(doacoes));
}

export function getDoacoes(){
    const dadosSalvos = localStorage.getItem(CHAVE_DOACOES);

    if (!dadosSalvos || dadosDesatualizados()) {
        return carregarExemplos();
    }

    return JSON.parse(dadosSalvos);
}

export function saveDoacoes(doacoesAtualizadas){

    localStorage.setItem(
        CHAVE_DOACOES,
         JSON.stringify(doacoesAtualizadas)

    );

}

export function adicionarDoacao(novaDoacao) {
    saveDoacoes([...getDoacoes(), novaDoacao]);
}