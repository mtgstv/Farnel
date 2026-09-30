import { statusDaDoacao } from "../../services/ordenacaoDoacoes";

// Números do próprio usuário, no estilo da faixa de estatísticas da home pública.
export default function ResumoUsuario({ minhasDoacoes, totalFavoritos }) {
    const contar = (status) => minhasDoacoes.filter((doacao) => statusDaDoacao(doacao) === status).length;

    const numeros = [
        { valor: minhasDoacoes.length, rotulo: "Doações feitas", sub: "Desde que você chegou" },
        { valor: contar("Disponível"), rotulo: "Disponíveis", sub: "Aguardando alguém solicitar" },
        { valor: contar("Concluída"), rotulo: "Concluídas", sub: "Já chegaram a quem precisa" },
        { valor: totalFavoritos, rotulo: "Favoritos", sub: "Doações que você salvou" },
    ];

    return (
        <section id="resumo" className="scroll-mt-20 bg-forest py-16 text-cream">
            <div className="container-page text-center">
                <p className="eyebrow-claro">Meu resumo</p>
                <h2 className="mt-3 text-2xl font-semibold text-cream sm:text-3xl">
                    A sua parte nessa rede de solidariedade
                </h2>

                <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
                    {numeros.map((numero) => (
                        <div
                            key={numero.rotulo}
                            className="rounded-2xl bg-forest-light/60 px-5 py-8 text-left ring-1 ring-white/10 transition-colors hover:bg-forest-light"
                        >
                            <p className="font-heading text-3xl font-semibold text-cream">{numero.valor}</p>
                            <p className="mt-2 text-sm font-semibold text-cream/90">{numero.rotulo}</p>
                            <p className="mt-1 text-xs text-cream/90">{numero.sub}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
