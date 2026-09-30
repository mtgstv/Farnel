/*
 * Cartão branco que agrupa os campos de filtro das listagens. Os campos se reorganizam
 * em uma coluna (celular), duas (tablet) ou uma linha (desktop), sem estourar a largura.
 * O primeiro campo (normalmente a busca) ocupa o espaço que sobrar na linha.
 */
function BarraFiltros({ children }) {
    return (
        <div className="grid gap-3 rounded-2xl bg-white p-4 shadow-card sm:grid-cols-2 sm:p-5 lg:flex lg:items-center [&>*:first-child]:sm:col-span-2 [&>*:first-child]:lg:flex-1">
            {children}
        </div>
    );
}

export default BarraFiltros;
