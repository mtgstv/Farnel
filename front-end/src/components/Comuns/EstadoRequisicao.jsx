import { AlertIcon } from "./Icons";

// Estados de uma requisição à API: carregando e erro (com "Tentar novamente").

export function Carregando({ texto = "Carregando..." }) {
    return (
        <div role="status" className="flex min-h-[40vh] flex-col items-center justify-center gap-4 py-16">
            <span aria-hidden="true" className="h-10 w-10 animate-spin rounded-full border-4 border-forest/15 border-t-forest" />
            <span className="text-sm font-medium text-ink-soft">{texto}</span>
        </div>
    );
}

// erro: o ErroApi da requisição. Sem conexão (status 0), explica que o servidor está fora do ar.
export function ErroAoCarregar({ erro, onTentarNovamente, titulo = "Não foi possível carregar" }) {
    const semConexao = erro?.status === 0;

    return (
        <div role="alert" className="cartao mx-auto max-w-lg p-8 text-center md:p-10">
            <AlertIcon aria-hidden="true" className="mx-auto h-10 w-10 text-terracotta" />
            <p className="eyebrow mt-4">{semConexao ? "Servidor fora do ar" : "Algo deu errado"}</p>
            <h2 className="mt-3 text-2xl font-semibold">{titulo}</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                {semConexao
                    ? "Não conseguimos falar com o servidor do Farnel agora. Confira sua internet ou tente de novo em instantes."
                    : erro?.message}
            </p>
            {onTentarNovamente && (
                <button type="button" onClick={onTentarNovamente} className="btn-primary mt-6">
                    Tentar novamente
                </button>
            )}
        </div>
    );
}
