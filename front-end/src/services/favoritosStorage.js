const CHAVE_FAVORITOS = "favoritos";

// Avisado sempre que os favoritos mudam, para todos os cards na tela se atualizarem
// (a mesma doação pode aparecer em mais de um lugar, como nas fileiras repetidas).
export const EVENTO_FAVORITOS_ALTERADOS = "favoritos-alterados";

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
    window.dispatchEvent(new Event(EVENTO_FAVORITOS_ALTERADOS));
}

export function limparFavoritos() {
    saveFavoritos([]);
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