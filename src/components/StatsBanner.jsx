import { stats } from "../data/content";

export default function StatsBanner() {
  return (
    <section className="bg-forest py-16 text-cream">
      <div className="container-page text-center">
        <p className="eyebrow text-terracotta">Nosso impacto em números</p>
        <h2 className="mt-3 text-2xl font-semibold text-cream sm:text-3xl">
          O tamanho da nossa rede de solidariedade
        </h2>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl bg-forest-light/60 px-5 py-8 text-left ring-1 ring-white/10 transition-colors hover:bg-forest-light"
            >
              <p className="font-heading text-2xl font-semibold text-cream sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm font-semibold text-cream/90">{stat.label}</p>
              <p className="mt-1 text-xs text-cream/60">{stat.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
