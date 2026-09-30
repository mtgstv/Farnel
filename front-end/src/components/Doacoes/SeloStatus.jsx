import { CORES_STATUS_SOBRE_FOTO, ESTILOS_STATUS } from "./estilosDoacao";

/*
 * Pílula com o status de uma doação ou solicitação.
 * - sobreFoto: versão com fundo branco, legível por cima de imagens
 * - rotulo: texto diferente do status (ex.: "Entregue" para uma solicitação concluída)
 */
function SeloStatus({ status, sobreFoto = false, rotulo, className = "" }) {
    const cores = sobreFoto
        ? `bg-white/90 shadow-sm ${CORES_STATUS_SOBRE_FOTO[status] ?? "text-ink"}`
        : ESTILOS_STATUS[status] ?? "bg-ink/10 text-ink";

    return (
        <span className={`inline-flex items-center whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${cores} ${className}`}>
            {status === "Concluída" && "✓ "}
            {rotulo ?? status}
        </span>
    );
}

export default SeloStatus;
