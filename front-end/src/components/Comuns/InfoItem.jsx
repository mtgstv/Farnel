// Par "rótulo / valor" das fichas de informação (detalhes da doação, modal, solicitações).
function InfoItem({ rotulo, children, className = "" }) {
    return (
        <div className={className}>
            <dt className="text-xs font-semibold uppercase tracking-wider text-ink-soft">{rotulo}</dt>
            <dd className="mt-1 text-sm font-medium text-ink">{children}</dd>
        </div>
    );
}

export default InfoItem;
