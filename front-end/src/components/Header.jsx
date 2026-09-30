import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowIcon } from "./Icons";
import Marca from "./Marca";

// "href": trechos desta página · "para": outra página do site
const NAV_LINKS = [
  { label: "Doações", para: "/doacoes" },
  { label: "Como Funciona", href: "#como-funciona" },
  { label: "Nossa Rede", href: "#nossa-rede" },
  { label: "Onde Atuamos", href: "#onde-atuamos" },
  { label: "Transparência", href: "#transparencia" },
];

// Link de página (Link do router) ou âncora para um trecho da home (<a href="#...">).
function LinkNav({ link, className, onClick }) {
  return link.para ? (
    <Link to={link.para} onClick={onClick} className={className}>{link.label}</Link>
  ) : (
    <a href={link.href} onClick={onClick} className={className}>{link.label}</a>
  );
}

const CLASSE_BOTAO_CONTORNO = "rounded-full border-2 border-forest/15 px-5 py-2.5 text-sm font-semibold text-forest-dark transition-colors hover:border-forest/30";

/*
 * Header da home de apresentação (visitantes): os links rolam para trechos da
 * própria página. Quem está logado usa o HeaderNavegacao.
 */
export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function fecharMenu() {
    setOpen(false);
  }

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-xl backdrop-saturate-150 transition-[background-color,border-color,box-shadow] duration-300 ${scrolled
        ? "border-line/60 bg-cream/60 shadow-[0_8px_24px_-12px_rgb(0_0_0/0.15)]"
        : "border-transparent bg-cream/0"
        }`}
    >
      <div className="container-page flex h-20 items-center justify-between">
        <a href="#top" className="flex items-center gap-3">
          <Marca />
        </a>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Principal">
          {NAV_LINKS.map((link) => (
            <LinkNav
              key={link.label}
              link={link}
              className="text-sm font-medium text-ink-soft transition-colors hover:text-forest-dark"
            />
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link to="/login" className={CLASSE_BOTAO_CONTORNO}>
            Entre
          </Link>
          <Link to="/cadastro" className="btn-primary">
            Cadastre-se
            <ArrowIcon className="h-4 w-4" />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-forest/15 text-forest-dark lg:hidden"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
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
          <nav className="flex flex-col gap-1" aria-label="Principal">
            {NAV_LINKS.map((link) => (
              <LinkNav
                key={link.label}
                link={link}
                onClick={fecharMenu}
                className="rounded-lg px-2 py-3 text-sm font-medium text-ink-soft hover:bg-cream-dark hover:text-forest-dark"
              />
            ))}
          </nav>

          <div className="mt-3 flex flex-col gap-3">
            <Link to="/login" onClick={fecharMenu} className={`${CLASSE_BOTAO_CONTORNO} text-center`}>
              Entre
            </Link>
            <Link to="/cadastro" onClick={fecharMenu} className={`${CLASSE_BOTAO_CONTORNO} text-center`}>
              Cadastre-se
            </Link>
            <Link to="/doacoes/nova" onClick={fecharMenu} className="btn-primary justify-center">
              Quero Doar
              <ArrowIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
