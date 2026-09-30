import { InstagramIcon, FacebookIcon, LinkedinIcon } from "./Icons";
import Marca from "./Marca";
import { Link } from "react-router-dom";
import { contato, footerLinks } from "../data/content";

function LinkColumn({ title, links }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-forest-dark">{title}</p>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.secao}>
            <Link to={`/sobre#${link.secao}`} className="text-sm text-ink-soft transition-colors hover:text-forest-dark">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-cream-dark">
      <div className="container-page grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <Link to="/" className="inline-flex items-center gap-3">
            <Marca />
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-soft">
            Conectamos quem tem alimento sobrando a quem precisa dele, reduzindo o
            desperdício e levando mais comida para a mesa de quem mais precisa.
          </p>
        </div>

        <LinkColumn title="Atuação" links={footerLinks.atuacao} />
        <LinkColumn title="Institucional" links={footerLinks.institucional} />

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-forest-dark">
            Contato &amp; Apoio
          </p>
          <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
            <li>
              <a href={`mailto:${contato.email}`} className="transition-colors hover:text-forest-dark">{contato.email}</a>
            </li>
            <li>
              <a href={`tel:${contato.telefone.replace(/\D/g, "")}`} className="transition-colors hover:text-forest-dark">{contato.telefone}</a>
            </li>
          </ul>
          <div className="mt-5 flex gap-3">
            {/* as redes ainda não existem: por enquanto levam ao contato */}
            {[
              ["Instagram", InstagramIcon],
              ["Facebook", FacebookIcon],
              ["LinkedIn", LinkedinIcon],
            ].map(([rede, Icon]) => (
              <Link
                key={rede}
                to="/sobre#contato"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-forest/15 text-forest-dark transition-colors hover:bg-forest hover:text-cream"
                aria-label={`${rede} do Farnel (em breve)`}
                title={`${rede} (em breve)`}
              >
                <Icon className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-page flex flex-col gap-3 py-6 text-xs text-ink-soft sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} Associação Farnel de Solidariedade Alimentar. Todos os direitos
            reservados. CNPJ: 00.123.456/0001-00
          </p>
          <div className="flex gap-5">
            {footerLinks.legal.map((link) => (
              <Link key={link.secao} to={`/sobre#${link.secao}`} className="hover:text-forest-dark">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
