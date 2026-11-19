import { requisicao } from "./api";

// Os números do "Meu painel", já contados pelo banco (GET /me/painel exige login)
export function buscarPainel() {
    return requisicao("/me/painel");
}
