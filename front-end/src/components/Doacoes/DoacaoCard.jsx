import FotoDoacao from "./FotoDoacao";
import SeloStatus from "./SeloStatus";
import { useFavorito } from "./useFavorito";
import { ESTILOS_ENCERRADA } from "./estilosDoacao";

/*
 * Card de doação das listas em grade (lista filtrada, histórico, favoritos).
 * - acoes: botões próprios no rodapé (ex.: no histórico), no lugar do favoritar
 * - mostrarFavorito: false esconde o botão de favoritar
 */
function DoacaoCard({ doacao, onVerDetalhes, mostrarFavorito = true, acoes }) {
    const { status, favoritado, bloqueado, alternar } = useFavorito(doacao);

    return (
        <article className={`flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-forest/5 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_35px_-18px_rgba(42,42,36,0.35)] ${ESTILOS_ENCERRADA[status] ?? ""}`}>
            {/* Foto de preview (ou o placeholder "sem imagem"); clicar também abre os detalhes */}
            <button
                type="button"
                tabIndex={-1}
                aria-hidden="true"
                onClick={() => onVerDetalhes(doacao)}
                className="group relative block aspect-[16/10] w-full overflow-hidden"
            >
                <FotoDoacao
                    doacao={doacao}
                    className="h-full w-full transition-transform duration-500 group-hover:scale-105"
                />
                <SeloStatus status={status} sobreFoto className="absolute left-3 top-3" />
            </button>

            <div className="flex flex-1 flex-col p-5">
                <p className="rotulo-categoria">{doacao.categoria}</p>
                <h2 className="mt-1.5 text-xl font-semibold">{doacao.titulo}</h2>

                <dl className="mt-4 mb-5 flex flex-col gap-2 text-sm text-ink-soft">
                    {[
                        ["Quantidade", doacao.quantidade],
                        ["Validade", doacao.validade],
                        ["Local", doacao.local],
                    ].map(([rotulo, valor]) => (
                        <div key={rotulo} className="flex gap-1.5">
                            <dt className="font-semibold text-ink">{rotulo}:</dt>
                            <dd>{valor}</dd>
                        </div>
                    ))}
                </dl>

                <div className="mt-auto flex flex-col gap-2">
                    <button type="button" onClick={() => onVerDetalhes(doacao)} className="btn-primary btn-sm w-full">
                        Ver detalhes
                    </button>

                    {acoes}

                    {!acoes && mostrarFavorito && (
                        <button
                            type="button"
                            onClick={alternar}
                            disabled={bloqueado}
                            title={bloqueado ? `Doações com status "${status}" não podem ser favoritadas` : undefined}
                            // bloqueado: tachado e tracejado, e ainda recebe o mouse para mostrar a explicação (title)
                            className={`btn-secundario btn-sm w-full ${bloqueado ? "border-dashed line-through disabled:pointer-events-auto disabled:opacity-80" : ""}`}
                        >
                            {favoritado ? "♥ Remover dos favoritos" : "♡ Adicionar aos favoritos"}
                        </button>
                    )}
                </div>
            </div>
        </article>
    );
}

export default DoacaoCard;
