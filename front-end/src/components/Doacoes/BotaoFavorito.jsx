// Coração redondo de favoritar (cards compactos e painel de destaque).
// Recebe o resultado de useFavorito(doacao).
function BotaoFavorito({ status, favoritado, bloqueado, alternar, className = "" }) {
    const rotulo = favoritado
        ? "Remover dos favoritos"
        : bloqueado
            ? `Doações com status "${status}" não podem ser favoritadas`
            : "Adicionar aos favoritos";

    return (
        <button
            type="button"
            onClick={alternar}
            disabled={bloqueado}
            aria-label={rotulo}
            title={rotulo}
            className={`flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-lg leading-none text-terracotta-dark shadow-card transition ${bloqueado
                ? "cursor-not-allowed border-2 border-dashed border-terracotta/60 line-through"
                : "hover:scale-110 hover:bg-white"
                } ${className}`}
        >
            {favoritado ? "♥" : "♡"}
        </button>
    );
}

export default BotaoFavorito;
