import { useLocation } from "react-router-dom";

// Para onde ir depois de entrar ou criar a conta: a página protegida que a pessoa
// tentou abrir (guardada pela RotaPrivada, com a busca, ex.: ?doacao=4) ou a home.
export function useDestinoAposLogin() {
    const origem = useLocation().state?.from;
    return origem ? `${origem.pathname}${origem.search ?? ""}` : "/";
}
