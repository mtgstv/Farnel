import { coverageRegions } from "../data/content";
import { ArrowIcon, PinIcon } from "./Icons";

export default function Coverage() {
  return (
    <section id="transparencia" className="bg-cream-dark py-20 md:py-24">
      <div className="container-page grid gap-14 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="eyebrow">Onde estamos atuando</p>
          <h2 className="mt-3 text-2xl font-semibold sm:text-3xl lg:text-[2rem]">
            Nossa Rede de Abastecimento no Brasil
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-soft sm:text-base">
            Expandindo rotas urbanas de combate à fome em grandes capitais e
            periferias. Conectamos hubs de distribuição descentralizados com
            foco na rapidez e na qualidade sanitária.
          </p>

          <ul className="mt-8 space-y-5">
            {coverageRegions.map((region) => (
              <li key={region.title} className="flex gap-3">
                <PinIcon className="mt-0.5 h-5 w-5 flex-none text-terracotta" />
                <div>
                  <p className="font-semibold text-forest-dark">{region.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">{region.text}</p>
                </div>
              </li>
            ))}
          </ul>

          <a href="#cidades" className="btn-primary mt-8">
            Ver Cidades Atendidas
            <ArrowIcon className="h-4 w-4" />
          </a>
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <div className="rounded-[2rem] bg-[#efe2c2] p-8 shadow-soft sm:p-10">
            <svg viewBox="0 0 360 380" className="h-full w-full" role="img" aria-label="Mapa estilizado do Brasil com regiões atendidas">
              <defs>
                <pattern id="dots" width="14" height="14" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.4" fill="#efe2c2" opacity="0.5" />
                </pattern>
              </defs>
              <path
                d="M150 20c40-10 80 4 100 30 18 22 14 46 34 60 22 16 30 44 18 68-10 20-6 40 6 56 14 18 8 44-14 54-18 8-28 26-50 30-24 4-40 26-66 24-30-2-46-24-62-44-18-22-44-30-54-56-10-24 2-46-6-70-8-24-30-38-26-64 4-28 30-42 46-64 18-24 46-16 74-24Z"
                fill="var(--color-forest)"
              />
              <path
                d="M150 20c40-10 80 4 100 30 18 22 14 46 34 60 22 16 30 44 18 68-10 20-6 40 6 56 14 18 8 44-14 54-18 8-28 26-50 30-24 4-40 26-66 24-30-2-46-24-62-44-18-22-44-30-54-56-10-24 2-46-6-70-8-24-30-38-26-64 4-28 30-42 46-64 18-24 46-16 74-24Z"
                fill="url(#dots)"
              />

              <g>
                <circle cx="150" cy="120" r="7" fill="var(--color-terracotta)" />
                <circle cx="150" cy="120" r="12" fill="var(--color-terracotta)" opacity="0.3" />
              </g>
              <g>
                <circle cx="188" cy="210" r="7" fill="var(--color-terracotta)" />
                <circle cx="188" cy="210" r="12" fill="var(--color-terracotta)" opacity="0.3" />
              </g>
              <g>
                <circle cx="205" cy="245" r="6" fill="#f4ead6" />
              </g>
              <g>
                <circle cx="120" cy="260" r="5" fill="#f4ead6" />
              </g>
            </svg>
          </div>

          <div className="absolute -bottom-5 -left-5 rounded-2xl bg-white px-5 py-4 shadow-card ring-1 ring-forest/5">
            <p className="text-xs font-semibold text-ink-soft">Cidades atendidas</p>
            <p className="font-heading text-xl font-semibold text-forest-dark">85+</p>
          </div>
        </div>
      </div>
    </section>
  );
}
