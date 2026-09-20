import { ArrowIcon, CheckBadge } from "./Icons";
import HeroCardStack from "./HeroCardStack";

export default function Hero() {
    return (
        <div className="relative isolate overflow-hidden">
            <div aria-hidden="true" className="dot-grid pointer-events-none absolute inset-0 -z-10" />
            <section id="top" className="container-page grid gap-14 ...">
                <section id="top" className="container-page grid gap-14 pt-6 pb-16 md:pt-8 md:pb-20 lg:grid-cols-2 lg:items-center lg:pt-10 lg:pb-24">
                    <div>
                        <p className="eyebrow">Solidariedade em ação no Brasil</p>
                        <h1 className="mt-4 text-4xl font-semibold text-forest-dark sm:text-5xl lg:text-[3.2rem] lg:leading-[1.08]">
                            Conectando quem quer ajudar com quem precisa de alimento
                        </h1>
                        <p className="mt-6 max-w-lg text-base leading-relaxed text-ink-soft">
                            O Farnel une diversos doadores, desde restaurantes, feiras, supermercados e até pequenos doadores diretamente a
                            cozinhas solidárias, ONGs locais ou apenas quem precisa receber. Menos desperdício de comida, mais
                            dignidade no prato de quem precisa.
                        </p>

                        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                            <a href="#doar" className="btn-primary">
                                Doe alimentos
                                <ArrowIcon className="h-4 w-4" />
                            </a>
                            <a href="#receber" className="btn-outline">
                                Ver doações disponíveis
                                <ArrowIcon className="h-4 w-4" />
                            </a>
                        </div>

                        <p className="mt-5 flex items-center gap-2 text-sm text-ink-soft">
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2">
                                    <CheckBadge className="h-4 w-4 shrink-0 text-forest" />
                                    <span>Doação 100% segura, monitorada e com benefícios fiscais</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckBadge className="h-4 w-4 shrink-0 text-forest" />
                                    <span>Selo Doador de Alimentos (Lei nº 15.224, de 30 de setembro de 2025)</span>
                                </li>
                            </ul>
                        </p>
                    </div>

                    <div className="relative">
                        <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-terracotta/15 blur-xl" />
                        <div className="absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-forest/10 blur-2xl" />

                        <div className="relative">
                            <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-terracotta/15 blur-xl" />
                            <div className="absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-forest/10 blur-2xl" />

                            <HeroCardStack />
                        </div>
                    </div>
                </section>
            </section>
        </div>
    );
}