const CHAVE_USUARIOS = "usuarios";

export function getUsuarios() {
    const dadosSalvos = localStorage.getItem(CHAVE_USUARIOS);

    if (dadosSalvos) {
        return JSON.parse(dadosSalvos);
    }

    localStorage.setItem(CHAVE_USUARIOS, JSON.stringify([]));

    return [];
}

export function saveUsuarios(usuarios) {
    localStorage.setItem(
        CHAVE_USUARIOS,
        JSON.stringify(usuarios)
    );
}