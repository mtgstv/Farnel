import { ArrowIcon, CheckBadge } from "./Icons";
import HeroCardStack from "./HeroCardStack";
import OrangeRain from "./OrangeRain";
import FloatingOranges from "./FloatingOranges";
import StatsCarousel from "./StatsCarousel";

export default function Hero() {
    return (
        <div className="relative isolate overflow-hidden">
            <div aria-hidden="true" className="dot-grid pointer-events-none absolute inset-0 -z-10" />
            <FloatingOranges />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 hidden lg:block">
                {/* esquerda: dois semicírculos com o centro na borda da tela */}
                <div className="absolute left-0 top-[18rem] h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-forest/15" />
                <div className="absolute left-0 top-[18rem] h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-forest/10" />

                {/* direita */}
                <div className="absolute -right-24 top-40 h-64 w-64 rounded-full border-2 border-terracotta/25" />
                <div className="absolute -right-32 bottom-16 h-80 w-80 rounded-full bg-terracotta/15 blur-2xl" />
            </div>

            <OrangeRain className="absolute left-0 top-[18rem] hidden h-72 w-72 -translate-x-1/2 -translate-y-1/2 2xl:block" />

            <section id="top" className="container-page grid gap-14 pt-6 pb-16 md:pt-8 md:pb-20 lg:grid-cols-2 lg:items-center lg:pt-10 lg:pb-24">
                <div className="relative rounded-3xl bg-cream/60 p-6 backdrop-blur-sm sm:p-8">
                    <p className="eyebrow">Solidariedade em ação no Brasil</p>
                    <h1 className="mt-4 text-4xl font-semibold text-forest-dark sm:text-5xl lg:text-[3.2rem] lg:leading-[1.08]">
                        Conectando quem quer <a href="/doe" className="destaquetitle destaquetext">ajudar</a> com quem precisa de alimento<span className="destaquetext">.</span>
                    </h1>
                    <p className="mt-6 max-w-lg text-base leading-relaxed text-ink-soft">
                        O Farnel une diversos doadores, desde restaurantes, feiras, supermercados e até pequenos doadores diretamente a
                        cozinhas solidárias, ONGs locais ou apenas quem precisa receber. Menos desperdício de comida, mais
                        dignidade no prato de quem precisa.
                    </p>

                    <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                        <a href="/doe" className="btn-primary">
                            Doe alimentos
                            <ArrowIcon className="h-4 w-4" />
                        </a>
                        <a href="/doacoes" className="btn-outline">
                            Ver doações disponíveis
                            <ArrowIcon className="h-4 w-4" />
                        </a>
                    </div>

                    <ul className="mt-5 space-y-2 text-sm text-ink-soft">
                        <li className="flex items-center gap-2">
                            <CheckBadge className="h-4 w-4 shrink-0 text-forest" />
                            <span>Doação 100% segura, monitorada e com benefícios fiscais</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckBadge className="h-4 w-4 shrink-0 text-forest" />
                            <span>Selo Doador de Alimentos (<a href="https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/l15224.htm" className="link-animado">Lei Nº 15.224, de 30 de setembro de 2025</a>)</span>
                        </li>
                    </ul>
                </div>

                <div className="relative">
                    <div className="absolute -right-0.5 -top-6 h-28 w-28 rounded-full bg-terracotta/70 blur-xl" />
                    <div className="absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-forest/50 blur-xl" />
                    <StatsCarousel />
                    <HeroCardStack />
                </div>
            </section>
        </div>
    );
}