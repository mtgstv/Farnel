import { doacoes as exemplos } from "../data/content";
import { ehLista, lerJSON, removerChave, salvarJSON } from "./armazenamento";
import { limparFavoritos } from "./favoritosStorage";

const CHAVE_DOACOES = "doacoes";

/*
 * Versão das doações de exemplo (data/content.js). Quando este número aumenta,
 * TODAS as doações salvas no navegador são apagadas e substituídas pelos exemplos,
 * e os favoritos e as solicitações são limpos (apontariam para doações que não existem mais).
 * Aumente só quando quiser recomeçar os dados do zero.
 */
const VERSAO_DADOS = 4;
const CHAVE_VERSAO_DADOS = "doacoesVersaoDados";

// Foto atual de cada doação de exemplo, pelo id.
const FOTOS_EXEMPLO = new Map(exemplos.map((exemplo) => [exemplo.id, exemplo.imagem]));

function dadosDesatualizados() {
    return lerJSON(CHAVE_VERSAO_DADOS, 0) < VERSAO_DADOS;
}

// Começa (ou recomeça) com as doações de exemplo.
function carregarExemplos() {
    saveDoacoes(exemplos);
    limparFavoritos();
    // As solicitações apontariam para doações que não existem mais. (Chave escrita aqui
    // em vez de importada de solicitacoesStorage, que já importa este arquivo.)
    removerChave("solicitacoes");
    salvarJSON(CHAVE_VERSAO_DADOS, VERSAO_DADOS);
    removerChave("doacoesVersaoExemplos"); // chave antiga, não é mais usada

    return structuredClone(exemplos);
}

/*
 * As doações de exemplo (sem dono) guardam o endereço da foto, que muda quando o site
 * é publicado de novo. Por isso a foto delas sempre vem do código, e não do que foi salvo.
 */
function comFotoAtual(doacao) {
    if (doacao.usuarioId || !FOTOS_EXEMPLO.has(doacao.id)) return doacao;
    return { ...doacao, imagem: FOTOS_EXEMPLO.get(doacao.id) };
}

export function getDoacoes() {
    // Sem dados, dados de uma versão antiga ou dados corrompidos: recomeça com os exemplos.
    const salvas = dadosDesatualizados() ? null : lerJSON(CHAVE_DOACOES, null, ehLista);
    return salvas ? salvas.map(comFotoAtual) : carregarExemplos();
}

// Devolve true se salvou.
export function saveDoacoes(doacoesAtualizadas) {
    return salvarJSON(CHAVE_DOACOES, doacoesAtualizadas);
}

// Devolve true se salvou (falha quando o armazenamento está cheio, geralmente por causa das fotos).
export function adicionarDoacao(novaDoacao) {
    return saveDoacoes([...getDoacoes(), novaDoacao]);
}
