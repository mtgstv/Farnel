// Seta ‹ › dos carrosséis: só aparece quando "visivel" (mouse na lateral), com foco do teclado
// ou em telas de toque (onde não existe "passar o mouse").
// "recuo": distância da borda do carrossel (padrão 1rem).
function BotaoSeta({ direcao, visivel, onClick, tamanho = "grande", rotulo, recuo = "1rem" }) {
    const esquerda = direcao === "esquerda";
    const dimensoes = tamanho === "grande" ? "h-12 w-12" : "h-10 w-10";

    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={rotulo ?? (esquerda ? "Anterior" : "Próximo")}
            className={`absolute top-1/2 z-50 flex -translate-y-1/2 items-center justify-center rounded-full bg-white text-forest-dark shadow-card ring-1 ring-forest/10 transition-opacity duration-200 hover:bg-cream focus-visible:pointer-events-auto focus-visible:opacity-100 [@media(hover:none)]:pointer-events-auto [@media(hover:none)]:opacity-100 ${dimensoes} ${visivel ? "opacity-100" : "pointer-events-none opacity-0"}`}
            style={esquerda ? { left: recuo } : { right: recuo }}
        >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-6 w-6">
                <path
                    d={esquerda ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </button>
    );
}

export default BotaoSeta;
