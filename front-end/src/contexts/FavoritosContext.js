import { createContext } from "react";

// Valor: { favoritos, carregando, erro, recarregar, ehFavorito, alternarFavorito } (ver FavoritosProvider)
export const FavoritosContext = createContext(null);
