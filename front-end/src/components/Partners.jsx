import { useRef } from "react";
import { partners } from "../data/content";
import { ArrowIcon, PinIcon } from "./Icons";

const TONE_STYLES = {
  forest: "from-forest to-forest-light",
  terracotta: "from-terracotta to-terracotta-dark",
  cream: "from-[#e7c98f] to-[#d9ac6a]",
  "forest-light": "from-forest-light to-forest-dark",
};

export default function Partners() {
  const trackRef = useRef(null);

  const scrollBy = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("[data-card]");
    const step = card ? card.getBoundingClientRect().width + 20 : 300;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section id="nossa-rede" className="bg-cream-dark py-20 md:py-24">
      <div className="container-page">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Quem executa na ponta</p>
            <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">
              Nossas organizações parceiras de confiança
            </h2>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-forest/15 text-forest-dark transition-colors hover:border-forest/30"
              aria-label="Parceiro anterior"
            >
              <ArrowIcon className="h-4 w-4 rotate-180" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-forest text-cream transition-colors hover:bg-forest-dark"
              aria-label="Próximo parceiro"
            >
              <ArrowIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {partners.map((partner) => (
            <article
              key={partner.name}
              data-card
              className="w-[240px] flex-none snap-start overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-forest/5 sm:w-[260px]"
            >
              <div
                className={`flex h-36 items-center justify-center bg-gradient-to-br ${TONE_STYLES[partner.tone]}`}
              >
                <PinIcon className="h-9 w-9 text-white/85" />
              </div>
              <div className="p-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-terracotta">
                  {partner.category}
                </p>
                <h3 className="mt-2 font-semibold text-forest-dark">{partner.name}</h3>
                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-ink-soft">
                  <PinIcon className="h-3.5 w-3.5 flex-none" />
                  {partner.location}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
