// Ponto único de comunicação com a API: toda requisição do site passa por aqui.
// O endereço vem do .env (VITE_API_URL); sem ele, usa a API rodando no próprio computador.
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api/v1";

// Disparado quando o login expira de vez; o AuthProvider escuta e desloga a pessoa.
export const EVENTO_SESSAO_EXPIRADA = "farnel:sessao-expirada";

/*
 * Erro de uma requisição.
 * - status: código HTTP (401, 404...). 0 = não foi possível falar com o servidor.
 * - campos: mensagem de cada campo inválido de um formulário (ex.: { email: "..." }), ou null.
 */
export class ErroApi extends Error {
    constructor(mensagem, status, campos = null) {
        super(mensagem);
        this.name = "ErroApi";
        this.status = status;
        this.campos = campos;
    }
}

async function enviar(caminho, opcoes) {
    try {
        // credentials: "include" envia junto os cookies de login (HttpOnly), que o JavaScript não consegue ler
        return await fetch(`${API_URL}${caminho}`, { credentials: "include", ...opcoes });
    } catch {
        throw new ErroApi("Não foi possível conectar ao servidor do Farnel. Confira sua internet e tente novamente.", 0);
    }
}

async function lerResposta(resposta) {
    if (!resposta.ok) {
        // A API sempre responde os erros no formato { message, campos }
        const erro = await resposta.json().catch(() => null);
        throw new ErroApi(
            erro?.message ?? mensagemPadrao(resposta.status),
            resposta.status,
            erro?.campos ?? null
        );
    }

    if (resposta.status === 204) {
        return null;
    }

    return resposta.json();
}

// Para respostas de erro que chegam sem mensagem (ex.: 401 e 403 do Spring Security)
function mensagemPadrao(status) {
    if (status === 401) return "Sua sessão expirou. Entre novamente.";
    if (status === 403) return "Você não tem permissão para fazer isso.";
    if (status >= 500) return "O servidor teve um problema. Tente novamente em instantes.";
    return `Erro na requisição (${status}).`;
}

let renovacaoEmAndamento = null;

// Usa o login salvo neste navegador para pedir um novo token de acesso.
// Devolve o usuário logado, ou null se não houver login salvo (ou se ele venceu).
// Chamadas ao mesmo tempo compartilham a mesma requisição.
export function renovarSessao() {
    renovacaoEmAndamento ??= enviar("/auth/refresh", { method: "POST" })
        .then(lerResposta)
        .catch(() => null)
        .finally(() => {
            renovacaoEmAndamento = null;
        });

    return renovacaoEmAndamento;
}

// corpo: objeto enviado como JSON. As outras opções vão direto para o fetch (ex.: method).
export async function requisicao(caminho, { corpo, ...opcoes } = {}) {
    const config = { ...opcoes };

    if (corpo !== undefined) {
        config.headers = { "Content-Type": "application/json", ...opcoes.headers };
        config.body = JSON.stringify(corpo);
    }

    let resposta = await enviar(caminho, config);

    // O token de acesso dura 15 minutos: quando vence, renova o login e tenta de novo uma vez.
    // As rotas de /auth tratam o próprio 401 (ex.: senha errada).
    if (resposta.status === 401 && !caminho.startsWith("/auth/")) {
        if (await renovarSessao()) {
            resposta = await enviar(caminho, config);
        } else {
            window.dispatchEvent(new Event(EVENTO_SESSAO_EXPIRADA));
        }
    }

    return lerResposta(resposta);
}
