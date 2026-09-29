const STATS = [
    { value: "+1.200", label: "Doações realizadas" },
    { value: "+100", label: "Empresas parceiras" },
    { value: "+50", label: "ONGs auxiliadas" },
];

export default function StatsCarousel() {
    return (
        <div
            role="group"
            aria-label="Nossos números"
            className="stats-carousel absolute inset-x-0 -bottom-[9rem] hidden overflow-hidden py-6 lg:block"
        >
            <div className="stats-track flex w-max">
                {[0, 1, 2].flatMap((copy) =>
                    STATS.map((s) => (
                        <div
                            key={`${copy}-${s.label}`}
                            aria-hidden={copy > 0 || undefined}
                            className="stat-card mr-5 shrink-0 rounded-2xl bg-white px-4 py-3 shadow-lg"
                        >
                            <p className="text-2xl font-semibold text-forest-dark">{s.value}</p>
                            <p className="whitespace-nowrap text-xs text-ink-soft">{s.label}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}