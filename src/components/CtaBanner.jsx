import { ArrowIcon, CheckBadge } from "./Icons";

export default function CtaBanner() {
  return (
    <section className="container-page pb-20 md:pb-24">
      <div className="rounded-[2rem] bg-forest px-8 py-14 text-center text-cream sm:px-14 sm:py-16">
        <h2 className="text-2xl font-semibold text-cream sm:text-3xl lg:text-[2.1rem]">
          Transforme o excedente em esperança hoje mesmo
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-cream/75 sm:text-base">
          Cadastre seu estabelecimento ou sua organização de caridade social. Nossos
          matches levam menos de 24 horas para se concretizarem de forma prática.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a href="#doar" className="btn-primary">
            Quero Ser Doador
            <ArrowIcon className="h-4 w-4" />
          </a>
          <a href="#receber" className="btn-outline-light">
            Quero Receber Doações
          </a>
        </div>

        <p className="mt-6 flex items-center justify-center gap-2 text-xs text-cream/70 sm:text-sm">
          <CheckBadge className="h-4 w-4 text-terracotta" />
          Junte-se a mais de 1.200 parceiros ativos que combatem a fome
        </p>
      </div>
    </section>
  );
}
