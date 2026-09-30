// Cores do selo de cada status (doações e solicitações), usadas pelo <SeloStatus>.
export const ESTILOS_STATUS = {
    // doações
    Disponível: "bg-forest/10 text-forest-dark",
    Solicitada: "bg-terracotta/15 text-terracotta-dark",
    Vencida: "bg-amber-100 text-amber-800",
    Concluída: "bg-forest-dark/15 text-forest-dark",
    Cancelada: "bg-red-100 text-red-700",
    // solicitações
    Pendente: "bg-amber-100 text-amber-800",
    Aceita: "bg-forest/10 text-forest-dark",
    Recusada: "bg-red-100 text-red-700",
};

// Mesmas cores, para o selo branco que fica por cima de uma foto.
export const CORES_STATUS_SOBRE_FOTO = {
    Disponível: "text-forest-dark",
    Solicitada: "text-terracotta-dark",
    Vencida: "text-amber-800",
    Concluída: "text-ink-soft",
    Cancelada: "text-red-700",
    Pendente: "text-amber-800",
    Aceita: "text-forest-dark",
    Recusada: "text-red-700",
};

// Doações encerradas ficam apagadas (voltam um pouco ao passar o mouse, para dar para ler):
// vencidas em tom sépia (amarelado); concluídas levemente, mantendo um pouco de cor;
// canceladas bem mais, em tons de cinza.
export const ESTILOS_ENCERRADA = {
    Vencida: "opacity-65 sepia-[.55] hover:opacity-90",
    Concluída: "opacity-75 saturate-50 hover:opacity-95",
    Cancelada: "opacity-55 grayscale hover:opacity-80",
};
