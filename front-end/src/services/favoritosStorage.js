const CHAVE_FAVORITOS = "favoritos";

export function getFavoritos() {
    const dadosSalvos = localStorage.getItem(CHAVE_FAVORITOS);

    if (dadosSalvos) {
        return JSON.parse(dadosSalvos);
    }

    localStorage.setItem(CHAVE_FAVORITOS, JSON.stringify([]));

    return [];
}

export function saveFavoritos(favoritos) {
    localStorage.setItem(
        CHAVE_FAVORITOS,
        JSON.stringify(favoritos)
    );
}

export function adicionarFavorito(doacao) {
    const favoritos = getFavoritos();

    const jaExiste = favoritos.some(
        (favorito) => favorito.id === doacao.id
    );

    if (jaExiste) {
        return favoritos;
    }

    const novosFavoritos = [...favoritos, doacao];

    saveFavoritos(novosFavoritos);

    return novosFavoritos;
}

export function removerFavorito(id) {
    const favoritos = getFavoritos();

    const novosFavoritos = favoritos.filter(
        (favorito) => favorito.id !== id
    );

    saveFavoritos(novosFavoritos);

    return novosFavoritos;
}

export function isFavorito(id) {
    const favoritos = getFavoritos();

    return favoritos.some(
        (favorito) => favorito.id === id
    );
}