import { useEffect, useState } from 'react'
import '../styles/hero-card-stack.css'

const INTERVAL_MS = 4000 // tempo entre trocas
const MOVE_MS = 700 // duração da animação de troca

// posição de cada carta na pilha (x em % da largura da carta)
const depthStyles = [
    { x: 0, scale: 1, opacity: 1, z: 30 }, // frente
    { x: 7, scale: 0.94, opacity: 0.9, z: 20 },
    { x: 14, scale: 0.88, opacity: 0.65, z: 10 },
]
const hiddenStyle = { x: 21, scale: 0.82, opacity: 0, z: 0 } // espera no fundo
const leavingStyle = { x: -18, scale: 1.02, opacity: 0, z: 40 } // saindo pela esquerda

/*
 * Pilha de cartas que troca sozinha a cada 4s (a carta da frente sai pela esquerda).
 * - itens: lista de qualquer coisa
 * - getKey(item): chave única de cada item
 * - renderCarta(item, naFrente): conteúdo da carta
 */
export default function PilhaDeCartas({ itens, getKey, renderCarta }) {
    const [{ active, leaving }, setState] = useState({ active: 0, leaving: null })
    const total = itens.length

    useEffect(() => {
        if (total < 2) return
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

        let timeout
        const interval = setInterval(() => {
            setState(({ active }) => ({
                active: (active + 1) % total,
                leaving: active,
            }))
            timeout = setTimeout(
                () => setState((s) => ({ ...s, leaving: null })),
                MOVE_MS,
            )
        }, INTERVAL_MS)

        return () => {
            clearInterval(interval)
            clearTimeout(timeout)
        }
    }, [total])

    return (
        <div className="relative mx-auto aspect-[560/520] w-full max-w-[560px]">
            {itens.map((item, i) => {
                const depth = (i - active + total) % total
                const s = i === leaving ? leavingStyle : (depthStyles[depth] ?? hiddenStyle)
                const naFrente = depth === 0 && i !== leaving

                return (
                    <div
                        key={getKey(item)}
                        aria-hidden={!naFrente}
                        inert={!naFrente}
                        className="absolute inset-y-0 left-0 w-[80%]"
                        style={{
                            transform: `translateX(${s.x}%) scale(${s.scale})`,
                            opacity: s.opacity,
                            zIndex: s.z,
                            transition: `transform ${MOVE_MS}ms cubic-bezier(.22,.8,.3,1), opacity ${MOVE_MS}ms ease`,
                        }}
                    >
                        <div
                            className="hero-float h-full w-full overflow-hidden rounded-3xl shadow-2xl shadow-black/15"
                            style={{ animationDelay: `${i * -1.5}s` }}
                        >
                            {renderCarta(item, naFrente)}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
