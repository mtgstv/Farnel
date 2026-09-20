import { BasketIcon, HandshakeIcon } from "./Icons";
import { donorSteps, receiverSteps } from "../data/content";

function StepList({ steps }) {
  return (
    <ol className="mt-6 space-y-5">
      {steps.map((step, index) => (
        <li key={step.title} className="flex gap-4">
          <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-terracotta/12 text-sm font-bold text-terracotta">
            {index + 1}
          </span>
          <div>
            <p className="font-semibold text-forest-dark">{step.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">{step.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="container-page py-20 md:py-24">
      <div className="text-center">
        <p className="eyebrow">O caminho do alimento</p>
        <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">Como funciona a plataforma</h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink-soft sm:text-base">
          Um processo seguro e rastreável construído para otimizar a distribuição de
          recursos e erradicar a fome urbana.
        </p>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-8 shadow-card ring-1 ring-forest/5 sm:p-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-terracotta/12 text-terracotta">
            <BasketIcon className="h-6 w-6" />
          </div>
          <h3 className="mt-5 text-xl font-semibold text-forest-dark">
            Quero Doar Alimentos
          </h3>
          <StepList steps={donorSteps} />
        </div>

        <div id="receber" className="rounded-3xl bg-white p-8 shadow-card ring-1 ring-forest/5 sm:p-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-terracotta/12 text-terracotta">
            <HandshakeIcon className="h-6 w-6" />
          </div>
          <h3 className="mt-5 text-xl font-semibold text-forest-dark">
            Quero Receber Doações
          </h3>
          <StepList steps={receiverSteps} />
        </div>
      </div>
    </section>
  );
}
