import { Link } from "react-router-dom";
import { ArrowIcon } from "../Comuns/Icons";
import FloatingOranges from "../Decoracao/FloatingOranges";
import OrangeRain from "../Decoracao/OrangeRain";
import CarrosselDoacoes from "./CarrosselDoacoes";
import "../../styles/hero.css";

// Topo da home de quem está logado: boas-vindas + carrossel com o histórico de doações.
export default function HeroLogado({ usuario, minhasDoacoes }) {
    const primeiroNome = usuario.nome.split(" ")[0];

    return (
        <div className="relative isolate overflow-hidden">
            <div aria-hidden="true" className="dot-grid pointer-events-none absolute inset-0 -z-10" />
            <FloatingOranges />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 hidden lg:block">
                <div className="absolute left-0 top-[18rem] h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-forest/15" />
                <div className="absolute left-0 top-[18rem] h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-forest/10" />
                <div className="absolute -right-24 top-40 h-64 w-64 rounded-full border-2 border-terracotta/25" />
                <div className="absolute -right-32 bottom-16 h-80 w-80 rounded-full bg-terracotta/15 blur-2xl" />
            </div>

            {/* Mesma laranja da home pública: ao clicar, chove uma laranja por doação disponível */}
            <OrangeRain className="absolute left-0 top-[18rem] hidden h-72 w-72 -translate-x-1/2 -translate-y-1/2 2xl:block" />

            <section id="top" className="container-page grid scroll-mt-24 gap-14 pt-6 pb-16 md:pt-8 md:pb-20 lg:grid-cols-2 lg:items-center lg:pt-10 lg:pb-24">
                <div className="relative rounded-3xl bg-cream/60 p-6 backdrop-blur-sm sm:p-8">
                    <p className="eyebrow">Bem-vindo de volta</p>
                    <h1 className="mt-4 text-4xl font-semibold text-forest-dark sm:text-5xl lg:text-[3.2rem] lg:leading-[1.08]">
                        Que bom te ver de novo, <span className="destaquetitle destaquetext">{primeiroNome}</span>
                        <span className="destaquetext">.</span>
                    </h1>
                    <p className="mt-6 max-w-lg text-base leading-relaxed text-ink-soft">
                        Acompanhe as suas doações, veja o que está disponível agora e continue
                        levando alimento para a mesa de quem precisa.
                    </p>

                    <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                        <Link to="/doacoes/nova" className="btn-primary">
                            Doar alimentos
                            <ArrowIcon className="h-4 w-4" />
                        </Link>
                        <Link to="/doacoes" className="btn-outline">
                            Ver doações disponíveis
                            <ArrowIcon className="h-4 w-4" />
                        </Link>
                    </div>

                    {minhasDoacoes.length > 0 && (
                        <Link
                            to="/minhas-doacoes"
                            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-forest-dark hover:underline"
                        >
                            Ver meu histórico completo
                            <ArrowIcon className="h-4 w-4" />
                        </Link>
                    )}
                </div>

                <div className="relative">
                    <div className="absolute -right-0.5 -top-6 h-28 w-28 rounded-full bg-terracotta/70 blur-xl" />
                    <div className="absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-forest/50 blur-xl" />

                    <p className="relative mb-4 text-sm font-semibold text-forest-dark">
                        Meu histórico de doações
                    </p>
                    <CarrosselDoacoes doacoes={minhasDoacoes} />
                </div>
            </section>
        </div>
    );
}
