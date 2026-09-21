import { useState } from "react";
import { createPortal } from "react-dom";
import laranjainteira from "../assets/laranjainteira.png";
import laranja from "../assets/laranja.png";

const DROP_COUNT = 36;
let uid = 0;

function makeDrops() {
    return Array.from({ length: DROP_COUNT }, () => ({
        id: uid++,
        left: Math.random() * 100,            // posição horizontal (vw)
        size: 22 + Math.random() * 30,        // tamanho (px)
        duration: 1.8 + Math.random() * 1.6,  // tempo da queda (s)
        delay: Math.random() * 0.8,           // atraso para não caírem todas juntas (s)
        drift: (Math.random() - 0.5) * 160,   // deslocamento lateral (px)
        rot: (Math.random() - 0.5) * 720,     // rotação total (graus)
    }));
}

export default function OrangeRain({ className = "" }) {
    const [drops, setDrops] = useState([]);
    const [spinKey, setSpinKey] = useState(0);

    const handleClick = () => {
        setSpinKey((k) => k + 1); // muda a key da imagem para reiniciar o giro a cada clique

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const batch = makeDrops();
        setDrops((current) => [...current, ...batch]);

        // remove as laranjas depois que terminam de cair
        setTimeout(() => {
            const ids = new Set(batch.map((d) => d.id));
            setDrops((current) => current.filter((d) => !ids.has(d.id)));
        }, 4500);
    };

    return (
        <>
            <button
                type="button"
                onClick={handleClick}
                aria-label="Fazer chover laranjas"
                className={`cursor-pointer transition-transform duration-200 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-terracotta ${className}`}
            >
                <img
                    key={spinKey}
                    src={laranja}
                    alt=""
                    draggable="false"
                    className={`h-full w-full select-none object-contain ${spinKey ? "orange-spin" : ""}`}
                />
            </button>

            {createPortal(
                <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
                    {drops.map((d) => (
                        <img
                            key={d.id}
                            src={laranjainteira}
                            alt=""
                            className="orange-drop"
                            style={{
                                left: `${d.left}vw`,
                                width: `${d.size}px`,
                                height: `${d.size}px`,
                                animationDuration: `${d.duration}s`,
                                animationDelay: `${d.delay}s`,
                                "--drift": `${d.drift}px`,
                                "--rot": `${d.rot}deg`,
                            }}
                        />
                    ))}
                </div>,
                document.body
            )}
        </>
    );
}