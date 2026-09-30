/*
 * Regras de ordenação das doações, usadas na lista de doações (/doacoes)
 * e no carrossel "Estas doações vencem primeiro" da home, para os dois
 * mostrarem sempre a mesma ordem.
 */

// "dd/mm/aaaa" → Date (ou null, para doações antigas sem a data).
export function converterData(data) {
    if (!data) return null;
    const [dia, mes, ano] = data.split("/");
    return new Date(ano, mes - 1, dia);
}

function inicioDeHoje() {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    return hoje;
}

// Quantos dias faltam para a validade (negativo = já venceu).
export function diasAteVencer(validade) {
    return Math.round((converterData(validade) - inicioDeHoje()) / 86400000);
}

export function textoVencimento(dias) {
    if (dias < 0) return dias === -1 ? "Venceu ontem" : `Venceu há ${-dias} dias`;
    if (dias === 0) return "Vence hoje";
    if (dias === 1) return "Vence amanhã";
    return `Vence em ${dias} dias`;
}

export function estaVencida(doacao) {
    const validade = converterData(doacao.validade);
    return validade !== null && validade < inicioDeHoje();
}

/*
 * Status mostrado na tela. "Vencida" não fica salvo na doação: uma doação ainda
 * ativa (Disponível ou Solicitada) cuja validade já passou aparece como "Vencida".
 * Concluídas e canceladas continuam com o próprio status.
 */
export function statusDaDoacao(doacao) {
    if (doacao.status === "Concluída" || doacao.status === "Cancelada") return doacao.status;
    return estaVencida(doacao) ? "Vencida" : doacao.status;
}

// Encerradas não podem mais ser favoritadas nem solicitadas.
export const STATUS_ENCERRADOS = ["Vencida", "Concluída", "Cancelada"];

export function estaEncerrada(doacao) {
    return STATUS_ENCERRADOS.includes(statusDaDoacao(doacao));
}

// Quantos ms a validade está de hoje (para frente ou para trás). Sem validade vai para o fim.
function distanciaDaValidade(doacao) {
    const validade = converterData(doacao.validade);
    return validade ? Math.abs(validade - inicioDeHoje()) : Number.MAX_SAFE_INTEGER;
}

const ORDENACOES = {
    // As que ainda valem primeiro (vence antes → depois); em seguida as vencidas (venceu há menos tempo → mais tempo).
    validade: (a, b) =>
        Number(estaVencida(a)) - Number(estaVencida(b)) ||
        distanciaDaValidade(a) - distanciaDaValidade(b),
    nome: (a, b) => a.titulo.localeCompare(b.titulo),
    recentes: (a, b) =>
        (converterData(b.dataCadastro) ?? 0) - (converterData(a.dataCadastro) ?? 0),
};

// Qualquer que seja a ordenação escolhida: ativas primeiro, depois vencidas, concluídas e, por último, canceladas.
const PESO_STATUS = { Vencida: 1, Concluída: 2, Cancelada: 3 };

function encerradasPorUltimo(a, b) {
    return (PESO_STATUS[statusDaDoacao(a)] ?? 0) - (PESO_STATUS[statusDaDoacao(b)] ?? 0);
}

// criterio: "validade" | "nome" | "recentes"
export function ordenarDoacoes(doacoes, criterio) {
    return [...doacoes].sort(
        (a, b) => encerradasPorUltimo(a, b) || ORDENACOES[criterio](a, b)
    );
}

// As primeiras da lista em "Validade mais próxima" que ainda estão valendo (nem vencidas, nem encerradas).
export function doacoesQueVencemPrimeiro(doacoes, quantidade) {
    return ordenarDoacoes(doacoes, "validade")
        .filter((doacao) => doacao.validade && !estaEncerrada(doacao))
        .slice(0, quantidade);
}
