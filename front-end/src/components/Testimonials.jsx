import { testimonials } from "../data/content";
import { QuoteMark } from "./Icons";

export default function Testimonials() {
  return (
    <section id="depoimentos" className="container-page py-20 md:py-24">
      <div className="text-center">
        <p className="eyebrow">Vozes de solidariedade</p>
        <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">
          Histórias de quem doa e quem recebe
        </h2>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {testimonials.map((item) => (
          <figure
            key={item.name}
            className="rounded-3xl bg-white p-8 shadow-card ring-1 ring-forest/5 sm:p-10"
          >
            <QuoteMark className="h-7 w-9 text-terracotta/70" />
            <blockquote className="mt-5 text-[15px] leading-relaxed text-ink-soft">
              “{item.quote}”
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-forest/10 font-heading text-base font-semibold text-forest-dark">
                {item.name.charAt(0)}
              </span>
              <span>
                <span className="block text-sm font-semibold text-forest-dark">
                  {item.name}
                </span>
                <span className="block text-xs text-ink-soft">{item.role}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
