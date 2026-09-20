import { useEffect, useState } from 'react'
import alimentos1 from '../assets/alimentos1.jpg'
import alimentos2 from '../assets/alimentos2.jpg'
import alimentos3 from '../assets/alimentos3.jpg'
import alimentos4 from '../assets/alimentos4.jpg'

const cards = [
    { src: alimentos1, alt: 'Batatas e batatas-doces frescas em caixas' },
    { src: alimentos2, alt: 'Descreva a segunda imagem' },
    { src: alimentos3, alt: 'Descreva a terceira imagem' },
    { src: alimentos4, alt: 'Descreva a quarta imagem' },
]

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

export default function HeroCardStack() {
    const [{ active, leaving }, setState] = useState({ active: 0, leaving: null })

    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

        let timeout
        const interval = setInterval(() => {
            setState(({ active }) => ({
                active: (active + 1) % cards.length,
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
    }, [])

    return (
        <div className="relative mx-auto aspect-[560/520] w-full max-w-[560px]">
            {cards.map((card, i) => {
                const depth = (i - active + cards.length) % cards.length
                const s = i === leaving ? leavingStyle : (depthStyles[depth] ?? hiddenStyle)

                return (
                    <div
                        key={card.src}
                        aria-hidden={depth !== 0}
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
                            <img
                                src={card.src}
                                alt={card.alt}
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </div>
                )
            })}
        </div>
    )
}