import { Link } from "react-router-dom";
import CarrosselVencimento from "./CarrosselVencimento";
import { ArrowIcon } from "../Icons";
import { doacoesQueVencemPrimeiro } from "../../services/ordenacaoDoacoes";

const QUANTIDADE = 8;

/*
 * As primeiras doações da lista em "Validade mais próxima" (/doacoes) que ainda
 * estão valendo. Usa a mesma função de ordenação da lista, para as duas baterem.
 */
export default function DoacoesDisponiveis({ doacoes }) {
    const vencemPrimeiro = doacoesQueVencemPrimeiro(doacoes, QUANTIDADE);

    return (
        <section id="disponiveis" className="scroll-mt-20 overflow-hidden py-20 md:py-24">
            <div className="container-page flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="eyebrow">Fique de olho no prazo</p>
                    <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">
                        Estas doações vencem primeiro
                    </h2>
                    <p className="mt-3 max-w-md text-sm text-ink-soft sm:text-base">
                        Conhece alguém ou alguma instituição que precisa? Compartilhe antes que o prazo acabe.
                    </p>
                </div>

                <Link to="/doacoes" className="btn-outline self-start sm:self-auto">
                    Ver todas as doações
                    <ArrowIcon className="h-4 w-4" />
                </Link>
            </div>

            {/* O carrossel ocupa a largura toda da tela, fora do container */}
            <div className="mt-6">
                {vencemPrimeiro.length === 0 ? (
                    <p className="container-page mt-4 rounded-2xl bg-white p-8 text-center text-sm text-ink-soft shadow-card">
                        Nenhuma doação dentro da validade no momento. Volte mais tarde!
                    </p>
                ) : (
                    <CarrosselVencimento doacoes={vencemPrimeiro} />
                )}
            </div>
        </section>
    );
}
