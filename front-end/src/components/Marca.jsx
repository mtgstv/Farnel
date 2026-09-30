import { SiteLogo } from "./Icons";

// Logo + nome "Farnel" + slogan, usado nos headers. "compacta" é a versão menor, sem slogan.
function Marca({ compacta = false }) {
  if (compacta) {
    return (
      <>
        <SiteLogo className="h-11 w-11" iconClassName="h-full w-full" />
        {/* top-1: o "F" da fonte Ballet sobe muito; desce o texto para centralizar com o ícone */}
        <span className="relative top-1 font-ballet text-[2.1rem] leading-none text-forest-dark [font-variation-settings:'opsz'_16] [-webkit-text-stroke:0.5px_currentColor]">
          Farnel
        </span>
      </>
    );
  }

  return (
    <>
      <SiteLogo className="relative -top-1 h-16 w-16" iconClassName="h-full w-full" />

      <div className="flex flex-col items-center">
        <span className="relative top-1 z-10 -mb-2 font-ballet text-[2.75rem] leading-none text-forest-dark [font-variation-settings:'opsz'_16] [-webkit-text-stroke:0.6px_currentColor] [text-shadow:0_0_8px_var(--color-cream),0_0_2px_var(--color-cream)]">
          Farnel
        </span>
        <span className="pl-[0.2em] text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-ink">
          Compartilhe. Alimente.
        </span>
      </div>
    </>
  );
}

export default Marca;
