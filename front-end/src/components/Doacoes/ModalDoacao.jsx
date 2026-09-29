import { Link } from "react-router-dom";

function ModalDoacao({ doacao, onFechar }) {
    const estilosStatus = {
        Disponível: "bg-forest/10 text-forest",
        Solicitada: "bg-terracotta/10 text-terracotta",
        Concluída: "bg-ink/10 text-ink-soft",
        Cancelada: "bg-red-100 text-red-700"
    };

    const estiloStatus = estilosStatus[doacao.status];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="relative max-h-[95vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-5 shadow-xl">

                <button
                    type="button"
                    onClick={onFechar}
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-xl text-ink-soft shadow-md hover:bg-gray-100"
                    aria-label="Fechar"
                >
                    ×
                </button>

                <img
                    src={doacao.imagem}
                    alt={doacao.titulo}
                    className="mb-4 h-40 w-full rounded-xl object-cover"
                />

                <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-terracotta">
                        {doacao.categoria}
                    </p>

                    <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${estiloStatus}`}
                    >
                        {doacao.status}
                    </span>
                </div>

                <h2 className="mb-2 text-xl font-bold">
                    {doacao.titulo}
                </h2>

                <p className="mb-4 text-sm leading-relaxed text-ink-soft">
                    {doacao.descricao}
                </p>

                <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                        <span className="text-gray-500">Quantidade</span>
                        <p className="font-medium">{doacao.quantidade}</p>
                    </div>

                    <div>
                        <span className="text-gray-500">Validade</span>
                        <p className="font-medium">{doacao.validade}</p>
                    </div>

                    <div>
                        <span className="text-gray-500">Local</span>
                        <p className="font-medium">{doacao.local}</p>
                    </div>

                    <div>
                        <span className="text-gray-500">Retirada</span>
                        <p className="font-medium">{doacao.tipoRetirada}</p>
                    </div>
                </div>

                <div className="mb-4">
                    <span className="text-sm text-gray-500">Observações</span>
                    <p className="text-sm text-ink-soft">
                        {doacao.observacoes}
                    </p>
                </div>

                <div className="mb-4">
                    <h3 className="mb-2 font-semibold">
                        Informações do doador
                    </h3>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                            <span className="text-gray-500">Doador</span>
                            <p className="font-medium">{doacao.doador}</p>
                        </div>

                        <div>
                            <span className="text-gray-500">Contato</span>
                            <p className="font-medium">{doacao.contato}</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    {doacao.status === "Disponível" && (
                        <button
                            type="button"
                            className="w-full rounded-xl bg-terracotta px-5 py-2.5 text-sm font-semibold text-white hover:bg-terracotta-dark"
                        >
                            Solicitar doação
                        </button>
                    )}

                    <Link
                        to={`/detalhes/${doacao.id}`}
                        className="w-full rounded-xl border border-terracotta px-5 py-2.5 text-center text-sm font-semibold text-terracotta hover:bg-terracotta/10"
                    >
                        Ver página completa
                    </Link>
                </div>

            </div>
        </div>
    );
}

export default ModalDoacao;