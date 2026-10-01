// Funções de formatação usadas nos formulários (doação, solicitação e perfil).

// Data de hoje no formato do <input type="date"> (aaaa-mm-dd), no fuso local.
export function hojeISO() {
    const agora = new Date();
    agora.setMinutes(agora.getMinutes() - agora.getTimezoneOffset());
    return agora.toISOString().slice(0, 10);
}

// aaaa-mm-dd → dd/mm/aaaa, o formato usado nas doações.
export function paraDataBR(dataISO) {
    const [ano, mes, dia] = dataISO.split("-");
    return `${dia}/${mes}/${ano}`;
}

// dd/mm/aaaa → aaaa-mm-dd (para usar como limite de um <input type="date">).
export function paraDataISO(dataBR) {
    const [dia, mes, ano] = dataBR.split("/");
    return `${ano}-${mes}-${dia}`;
}

// Aplica a máscara (11) 99999-9999 ou (11) 9999-9999 enquanto a pessoa digita.
export function formatarTelefone(valor) {
    const n = valor.replace(/\D/g, "").slice(0, 11);

    if (n.length === 0) return "";
    if (n.length <= 2) return `(${n}`;
    if (n.length <= 6) return `(${n.slice(0, 2)}) ${n.slice(2)}`;
    if (n.length <= 10) return `(${n.slice(0, 2)}) ${n.slice(2, 6)}-${n.slice(6)}`;
    return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}`;
}

export function telefoneValido(valor) {
    return valor.replace(/\D/g, "").length >= 10;
}

// Formato básico de e-mail: algo@dominio.ext, sem espaços.
export function emailValido(valor) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor.trim());
}
