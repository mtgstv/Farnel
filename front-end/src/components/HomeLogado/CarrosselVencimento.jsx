import { Link } from "react-router-dom";
import FotoDoacao from "../Doacoes/FotoDoacao";
import SeloStatus from "../Doacoes/SeloStatus";
import BotaoSeta from "../Comuns/BotaoSeta";
import { useCarrosselAutomatico } from "../../hooks/useCarrosselAutomatico";
import { useLadoDoMouse } from "../../hooks/useLadoDoMouse";
import { diasAteVencer, textoVencimento } from "../../services/ordenacaoDoacoes";
import { ArrowIcon, PinIcon } from "../Comuns/Icons";
import "../../styles/hero-card-stack.css";
import "../../styles/carrossel-vencimento.css";

const MOVIMENTO_MS = 700; // duração do deslize
const TAMANHO_RESUMO = 110;

// Corta a descrição sem quebrar palavras. Algumas doações não têm descrição.
function resumir(texto) {
    if (!texto) return "Sem descrição.";
    if (texto.length <= TAMANHO_RESUMO) return texto;
    const corte = texto.slice(0, TAMANHO_RESUMO);
    const ultimoEspaco = corte.lastIndexOf(" ");
    return `${ultimoEspaco > 0 ? corte.slice(0, ultimoEspaco) : corte}…`;
}

/*
 * Posição do card i em relação ao ativo: 0 = centro, -1 = à esquerda, 1 = à direita...
 * A lista é circular, então o último card fica à esquerda do primeiro.
 */
function deslocamento(i, ativo, total) {
    const d = (i - ativo + total) % total;
    return d > total / 2 ? d - total : d;
}

// Por distância do centro: escala e opacidade de cada "camada" da pilha.
const CAMADAS = [
    { escala: 1, opacidade: 1 },
    { escala: 0.8, opacidade: 0.9 },
    { escala: 0.66, opacidade: 0.55 },
];
const ESCONDIDO = { escala: 0.6, opacidade: 0 };

function estiloDoCard(d, dAnterior) {
    const distancia = Math.abs(d);
    const { escala, opacidade } = CAMADAS[distancia] ?? ESCONDIDO;

    return {
        // Cada card anda 74% da largura: os laterais ficam parcialmente atrás do central.
        transform: `translateX(calc(-50% + ${d} * 74%)) scale(${escala})`,
        opacity: opacidade,
        zIndex: 30 - distancia,
        // Card que "deu a volta" (da ponta esquerda para a direita) pula sem animar, invisível.
        transition: Math.abs(d - dAnterior) > 1
            ? "none"
            : `transform ${MOVIMENTO_MS}ms cubic-bezier(.22,.8,.3,1), opacity ${MOVIMENTO_MS}ms ease`,
    };
}

function ConteudoCard({ doacao }) {
    const dias = diasAteVencer(doacao.validade);

    return (
        <>
            <FotoDoacao doacao={doacao} className="h-full w-full" />

            <div className="absolute left-4 top-4 flex gap-2">
                <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-forest-dark">
                    {doacao.categoria}
                </span>
                {doacao.status !== "Disponível" && <SeloStatus status={doacao.status} sobreFoto />}
            </div>
            <span className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-semibold text-white ${dias <= 3 ? "bg-terracotta" : "bg-forest"}`}>
                {textoVencimento(dias)}
            </span>
        </>
    );
}

// Balão com o resumo da doação ativa, sobreposto à parte de baixo do card.
function BalaoResumo({ doacao, indice, total }) {
    return (
        <div className={`balao-doacao relative z-40 mx-auto -mt-26 w-[min(76vw,600px)] rounded-2xl bg-white p-5 shadow-[0_18px_40px_-18px_rgba(42,42,36,0.45)] ring-1 ring-forest/5`}>
            <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-semibold text-forest-dark">{doacao.titulo}</h3>
                <span className="flex-none text-xs font-medium text-ink-soft">
                    {indice + 1} de {total}
                </span>
            </div>

            <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{resumir(doacao.descricao)}</p>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-ink">
                <span>{doacao.quantidade}</span>
                <span className="flex items-center gap-1">
                    <PinIcon className="h-3.5 w-3.5 text-terracotta" />
                    {doacao.local}
                </span>
            </div>

            <Link
                to={`/detalhes/${doacao.id}`}
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-terracotta-dark hover:underline"
            >
                Ver detalhes
                <ArrowIcon className="h-4 w-4" />
            </Link>
        </div>
    );
}

// Carrossel horizontal das doações que vencem primeiro, ocupando a largura da tela.
export default function CarrosselVencimento({ doacoes }) {
    const total = doacoes.length;
    const { ativo: indiceAtivo, anterior, navegar } = useCarrosselAutomatico(total);
    const [ladoDoMouse, eventosDoMouse] = useLadoDoMouse();

    return (
        <div>
            {/* As setas ficam fora da faixa com fade, senão também sumiriam nas bordas */}
            <div className="relative" {...eventosDoMouse}>
                <div className={`carrossel-faixa relative h-[calc(min(84vw,760px)*0.625+6rem)] overflow-hidden`}>
                    {doacoes.map((doacao, i) => {
                        const d = deslocamento(i, indiceAtivo, total);
                        const noCentro = d === 0;
                        const classeCard = `absolute left-1/2 top-12 block aspect-[16/10] w-[min(84vw,760px)]`;

                        return noCentro ? (
                            <Link
                                key={doacao.id}
                                to={`/detalhes/${doacao.id}`}
                                aria-label={doacao.titulo}
                                className={classeCard}
                                style={estiloDoCard(d, deslocamento(i, anterior, total))}
                            >
                                <div
                                    className="hero-float relative h-full w-full overflow-hidden rounded-3xl shadow-2xl shadow-black/15"
                                    style={{ animationDelay: `${i * -1.5}s` }}
                                >
                                    <ConteudoCard doacao={doacao} />
                                </div>
                            </Link>
                        ) : (
                            // Cards laterais: clicar traz o card para o centro (e pausa a animação).
                            <button
                                key={doacao.id}
                                type="button"
                                tabIndex={-1}
                                aria-hidden="true"
                                onClick={() => navegar(d)}
                                className={`${classeCard} text-left`}
                                style={estiloDoCard(d, deslocamento(i, anterior, total))}
                            >
                                <div
                                    className="hero-float relative h-full w-full overflow-hidden rounded-3xl shadow-2xl shadow-black/15"
                                    style={{ animationDelay: `${i * -1.5}s` }}
                                >
                                    <ConteudoCard doacao={doacao} />
                                </div>
                            </button>
                        );
                    })}
                </div>

                {total > 1 && (
                    <>
                        <BotaoSeta direcao="esquerda" rotulo="Doação anterior" visivel={ladoDoMouse === "esquerda"} onClick={() => navegar(-1)} />
                        <BotaoSeta direcao="direita" rotulo="Próxima doação" visivel={ladoDoMouse === "direita"} onClick={() => navegar(1)} />
                    </>
                )}
            </div>

            {/* key muda a cada troca → o balão é recriado e a animação de entrada roda de novo */}
            <BalaoResumo key={doacoes[indiceAtivo].id} doacao={doacoes[indiceAtivo]} indice={indiceAtivo} total={total} />
        </div>
    );
}
