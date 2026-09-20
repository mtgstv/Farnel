import { LeafLogo, InstagramIcon, FacebookIcon, LinkedinIcon } from "./Icons";
import { footerLinks } from "../data/content";

function LinkColumn({ title, links }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-forest-dark">{title}</p>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link}>
            <a href="#" className="text-sm text-ink-soft transition-colors hover:text-forest-dark">
              {link}
            </a>
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
          <div className="flex flex-col items-center">
            <span
              className="relative z-10 -mb-2 font-ballet text-[2.75rem] leading-none text-forest-dark [font-variation-settings:'opsz'_16] [-webkit-text-stroke:0.6px_currentColor] [text-shadow:0_0_8px_var(--color-cream),0_0_2px_var(--color-cream)]"
            >
              Farnel
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-soft">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique soluta nulla illo laboriosam consectetur suscipit nostrum aliquid cupiditate? Magnam, animi fugit dolorem pariatur architecto et ipsa tempore quae placeat nam.
          </p>
        </div>

        <LinkColumn title="Atuação" links={footerLinks.atuacao} />
        <LinkColumn title="Institucional" links={footerLinks.institucional} />

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-forest-dark">
            Contato &amp; Apoio
          </p>
          <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
            <li>contato@pratocheio.org</li>
            <li>0800 555 3321</li>
          </ul>
          <div className="mt-5 flex gap-3">
            {[InstagramIcon, FacebookIcon, LinkedinIcon].map((Icon, index) => (
              <a
                key={index}
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-forest/15 text-forest-dark transition-colors hover:bg-forest hover:text-cream"
                aria-label="Rede social"
              >
                <Icon className="h-4 w-4" />
              </a>
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
            {/* Aqui eu preciso fazer uma página com essas informações abaixo */}
            <a href="#" className="hover:text-forest-dark"> 
              Política de Privacidade
            </a>
            <a href="#" className="hover:text-forest-dark">
              Termos de Uso
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
