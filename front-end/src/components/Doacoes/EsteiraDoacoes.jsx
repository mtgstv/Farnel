import BotaoSeta from "../Comuns/BotaoSeta";
import { useCarrosselAutomatico } from "../../hooks/useCarrosselAutomatico";
import { useLadoDoMouse } from "../../hooks/useLadoDoMouse";
import "../../styles/fileira-doacoes.css";

const MOVIMENTO_MS = 700;

// Quantidade mínima de posições: o bastante para cobrir o container largo e ainda sobrar
// uma posição escondida além da borda direita.
const MINIMO_DE_POSICOES = 10;

/*
 * Posição de uma "vaga": -1 = saindo pela esquerda, 0 = primeira (alinhada com o texto
 * do container), 1, 2... para a direita. A fila é circular.
 */
function posicaoNaFila(vaga, ativo, totalDeVagas) {
    const d = (vaga - ativo + totalDeVagas) % totalDeVagas;
    return d === totalDeVagas - 1 ? -1 : d;
}

/*
 * Esteira de cards lado a lado: a cada "intervalo" ms todos avançam uma posição para a
 * esquerda e somem com fade na borda do container. As doações se repetem até preencher
 * a largura, como uma faixa contínua. Pausa com o mouse em cima e por 8s depois das setas.
 *
 * Deve ficar dentro de um container com recuo lateral (container-largo): ela se estende
 * por esse recuo, e é nele que acontece o fade.
 *
 * - renderCartao(doacao): o card de cada doação
 * - classeCard: tamanho de cada card (ex.: "h-[18.5rem] w-64")
 * - classeFaixa: altura da faixa (um pouco maior que o card, para sombra e flutuação)
 */
function EsteiraDoacoes({ doacoes, renderCartao, classeCard, classeFaixa, rotulo, intervalo = 6000 }) {
    const total = doacoes.length;
    const copias = Math.max(1, Math.ceil(MINIMO_DE_POSICOES / total));
    const vagas = Array.from({ length: total * copias }, (_, vaga) => ({
        vaga,
        doacao: doacoes[vaga % total],
        copia: vaga >= total, // repetições: fora da navegação por teclado e de leitores de tela
    }));

    const { ativo, anterior, navegar, setMouseEmCima } = useCarrosselAutomatico(vagas.length, { intervalo });
    const [ladoDoMouse, eventosDoMouse] = useLadoDoMouse(0.12);

    return (
        <div
            className="relative -mx-6 md:-mx-10"
            onMouseEnter={() => setMouseEmCima(true)}
            onMouseMove={eventosDoMouse.onMouseMove}
            onMouseLeave={() => {
                setMouseEmCima(false);
                eventosDoMouse.onMouseLeave();
            }}
        >
            <div className={`esteira-faixa relative overflow-hidden ${classeFaixa}`}>
                {vagas.map(({ vaga, doacao, copia }) => {
                    const posicao = posicaoNaFila(vaga, ativo, vagas.length);
                    // A vaga que dá a volta pula para a outra ponta sem atravessar a tela animando.
                    const deuVolta = Math.abs(posicao - posicaoNaFila(vaga, anterior, vagas.length)) > 1;

                    return (
                        <div
                            key={vaga}
                            aria-hidden={copia || undefined}
                            inert={copia}
                            // mesmo recuo do container: a primeira vaga fica alinhada com os títulos
                            className={`absolute left-6 top-3 md:left-10 ${classeCard}`}
                            style={{
                                transform: `translateX(calc(${posicao} * (100% + 1.25rem)))`,
                                transition: deuVolta ? "none" : `transform ${MOVIMENTO_MS}ms cubic-bezier(.22,.8,.3,1)`,
                                animation: deuVolta ? `esteira-entrar ${MOVIMENTO_MS}ms ease both` : undefined,
                            }}
                        >
                            <div className="flutuar-suave h-full w-full" style={{ animationDelay: `${(vaga % total) * -1.5}s` }}>
                                {renderCartao(doacao)}
                            </div>
                        </div>
                    );
                })}
            </div>

            {total > 1 && (
                <>
                    <BotaoSeta
                        direcao="esquerda"
                        tamanho="pequeno"
                        rotulo={`${rotulo}: anterior`}
                        visivel={ladoDoMouse === "esquerda"}
                        onClick={() => navegar(-1)}
                    />
                    <BotaoSeta
                        direcao="direita"
                        tamanho="pequeno"
                        rotulo={`${rotulo}: próxima`}
                        visivel={ladoDoMouse === "direita"}
                        onClick={() => navegar(1)}
                    />
                </>
            )}
        </div>
    );
}

export default EsteiraDoacoes;
