function DoacaoCard ({categoria, titulo, quantidade, validade, local, status}){

    const estilosStatus = {
        Disponível: "bg-forest/10 text-forest",
        Solicitada: "bg-terracotta/10 text-terracotta",
        Concluída: "bg-ink/10 text-ink-soft",
        Cancelada: "bg-red-100 text-red-700"
    };

    const estiloStatus = estilosStatus[status];
    return(
        <div className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_35px_-18px_rgba(42,42,36,0.35)]">


            <div className="mb-4 flex items-center justify-between gap-3" >
                <p className="text-xs font-semibold uppercase tracking-wider text-terracotta">
                    {categoria}
                </p>
            
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${estiloStatus}`}>
                    {status}
                </span>

            </div>

            <h2 className="mb-5 text-xl font-bold">
                {titulo}
            </h2>
            
            <div className="mb-6 flex flex-col gap-3 text-sm text-ink-soft">
                <p>
                    <span className="font-semibold text-ink">Quantidade:</span>{" "}
                    {quantidade}
                </p>

                <p>
                    <span className="font-semibold text-ink">Validade:</span>{" "}
                    {validade}
                </p>

                <p>
                    <span className="font-semibold text-ink">Local:</span>{" "}
                    {local}
                </p>
            </div>
            <button

                type="button"
                className="mt-auto w-full rounded-xl bg-terracotta px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-terracotta-dark"
                >
                Ver detalhes
            </button>
        </div>
    )
}

export default DoacaoCard;