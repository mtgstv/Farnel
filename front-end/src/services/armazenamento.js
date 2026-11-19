/*
 * Leitura e escrita no localStorage usadas por todos os serviços.
 * - Dado corrompido (JSON inválido ou formato inesperado) vira o valor padrão,
 *   em vez de derrubar o site com a tela em branco.
 * - Armazenamento cheio não lança erro: a escrita devolve false e o site
 *   avisa a pessoa (veja AvisoArmazenamento).
 */

// Disparado quando algo não pôde ser salvo (normalmente, armazenamento cheio por causa das fotos).
export const EVENTO_FALHA_AO_SALVAR = "falha-ao-salvar";

// "valido" confere o formato do dado lido (ex.: Array.isArray).
export function lerJSON(chave, padrao, valido = () => true) {
    try {
        const dadosSalvos = localStorage.getItem(chave);
        if (dadosSalvos === null) return padrao;

        const valor = JSON.parse(dadosSalvos);
        return valor !== null && valido(valor) ? valor : padrao;
    } catch {
        return padrao;
    }
}

// Devolve true se salvou.
export function salvarJSON(chave, valor) {
    try {
        localStorage.setItem(chave, JSON.stringify(valor));
        return true;
    } catch {
        window.dispatchEvent(new Event(EVENTO_FALHA_AO_SALVAR));
        return false;
    }
}

export function removerChave(chave) {
    try {
        localStorage.removeItem(chave);
    } catch {
        // sem acesso ao armazenamento (ex.: bloqueado pelo navegador): não há o que remover
    }
}

/*
 * Na AV1, tudo ficava no localStorage, inclusive as contas (com a senha!). Agora quem guarda
 * os dados é a API (senha só como hash no banco; sessão em cookie HttpOnly), então os dados
 * antigos são apagados ao abrir o site, para não deixar senhas esquecidas no navegador.
 */
const CHAVES_DA_AV1 = [
    "usuarios",
    "usuarioLogado",
    "favoritos",
    "doacoes",
    "doacoesVersaoDados",
    "doacoesVersaoExemplos",
    "solicitacoes",
];

export function limparDadosDaAV1() {
    CHAVES_DA_AV1.forEach(removerChave);
}

export const ehLista = Array.isArray;
export const ehObjeto = (valor) => typeof valor === "object" && !Array.isArray(valor);
