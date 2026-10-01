import { Link } from "react-router-dom";
import PilhaDeCartas from "../Comuns/PilhaDeCartas";
import FotoDoacao from "../Doacoes/FotoDoacao";
import SeloStatus from "../Doacoes/SeloStatus";
import { statusDaDoacao } from "../../services/ordenacaoDoacoes";
import { ArrowIcon } from "../Comuns/Icons";

function CartaDoacao({ doacao }) {
    const status = statusDaDoacao(doacao);

    return (
        <Link to={`/detalhes/${doacao.id}`} className="group relative block h-full w-full">
            <FotoDoacao
                doacao={doacao}
                className="h-full w-full transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-forest-dark/90 via-forest-dark/25 to-transparent" />

            <SeloStatus status={status} sobreFoto className="absolute left-5 top-5" />

            <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-terracotta-light">
                    {doacao.categoria}
                </p>
                <p className="mt-1 font-heading text-2xl font-semibold text-cream">
                    {doacao.titulo}
                </p>
                <p className="mt-2 text-sm text-cream/80">
                    {doacao.quantidade} · doado em {doacao.dataCadastro}
                </p>
            </div>
        </Link>
    );
}

// Histórico de doações do usuário, no mesmo estilo de pilha do carrossel da home pública.
export default function CarrosselDoacoes({ doacoes }) {
    if (doacoes.length === 0) {
        return (
            <div className="relative mx-auto flex aspect-[560/520] w-full max-w-[560px] items-center">
                <div className="flex h-full w-[80%] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-forest/20 bg-white/70 p-8 text-center">
                    <p className="font-heading text-2xl font-semibold text-forest-dark">
                        Seu histórico começa aqui
                    </p>
                    <p className="mt-3 text-sm text-ink-soft">
                        Suas doações vão aparecer neste carrossel assim que você publicar a primeira.
                    </p>
                    <Link to="/doacoes/nova" className="btn-primary mt-6">
                        Fazer minha primeira doação
                        <ArrowIcon className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <PilhaDeCartas
            itens={doacoes}
            getKey={(doacao) => doacao.id}
            renderCarta={(doacao) => <CartaDoacao doacao={doacao} />}
        />
    );
}
