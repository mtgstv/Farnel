import { useEffect, useState } from "react";
import { SiteLogo, ArrowIcon } from "./Icons";

const NAV_LINKS = [
  { label: "Como Funciona", href: "#como-funciona" },
  { label: "Nossa Rede", href: "#nossa-rede" },
  { label: "Transparência", href: "#transparencia" },
  { label: "Quem Apoia", href: "#depoimentos" },
];



export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-xl backdrop-saturate-150 transition-[background-color,border-color,box-shadow] duration-300 ${scrolled
        ? "border-line/60 bg-cream/60 shadow-[0_8px_24px_-12px_rgb(0_0_0/0.15)]"
        : "border-transparent bg-cream/0"
        }`}
    >
      <div className="container-page flex h-20 items-center justify-between">
        <a href="#top" className="flex items-center gap-3">
          <SiteLogo className="relative -top-1 h-16 w-16" iconClassName="h-full w-full" />

          <div className="flex flex-col items-center">
            <span className="relative top-1 z-10 -mb-2 font-ballet text-[2.75rem] leading-none text-forest-dark [font-variation-settings:'opsz'_16] [-webkit-text-stroke:0.6px_currentColor] [text-shadow:0_0_8px_var(--color-cream),0_0_2px_var(--color-cream)]">
              Farnel
            </span>
            <span className="pl-[0.2em] text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-ink">
              Compartilhe. Alimente.
            </span>
          </div>
        </a>
        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-ink-soft transition-colors hover:text-forest-dark"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href="#area-ong"
            className="rounded-full border-2 border-forest/15 px-5 py-2.5 text-sm font-semibold text-forest-dark transition-colors hover:border-forest/30"
          >
            Entre
          </a>
          <a href="#doar" className="btn-primary">
            Cadastre-se
            <ArrowIcon className="h-4 w-4" />
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-forest/15 text-forest-dark lg:hidden"
          aria-label="Abrir menu"
          aria-expanded={open}
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-line/70 bg-cream px-6 pb-6 pt-2 lg:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-3 text-sm font-medium text-ink-soft hover:bg-cream-dark hover:text-forest-dark"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-3 flex flex-col gap-3">
            <a
              href="#area-ong"
              onClick={() => setOpen(false)}
              className="rounded-full border-2 border-forest/15 px-5 py-2.5 text-center text-sm font-semibold text-forest-dark"
            >
              Área da ONG
            </a>
            <a href="#doar" onClick={() => setOpen(false)} className="btn-primary justify-center">
              Quero Doar
              <ArrowIcon className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
