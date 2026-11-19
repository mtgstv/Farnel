import { useContext } from "react";
import { FavoritosContext } from "../contexts/FavoritosContext";

// { favoritos, carregando, erro, recarregar, ehFavorito, alternarFavorito } (ver contexts/FavoritosProvider)
export function useFavoritos() {
    const contexto = useContext(FavoritosContext);

    if (!contexto) {
        throw new Error("useFavoritos precisa ser usado dentro do <FavoritosProvider>.");
    }

    return contexto;
}
