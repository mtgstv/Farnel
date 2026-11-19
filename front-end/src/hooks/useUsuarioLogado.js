import { useAuth } from "./useAuth";

// Usuário logado (ou null): { id, nome, email, papel, tipo, criadoEm }.
// Atualiza sozinho quando alguém entra ou sai (vem do AuthProvider).
export function useUsuarioLogado() {
    return useAuth().usuario;
}
