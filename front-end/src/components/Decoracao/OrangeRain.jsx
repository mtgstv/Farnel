import { useState } from "react";
import { createPortal } from "react-dom";
import laranjainteira from "../../assets/laranjainteira.png";
import laranja from "../../assets/Laranja.png";
import { getDoacoes } from "../../services/doacoesStorage";
import { statusDaDoacao } from "../../services/ordenacaoDoacoes";
import "../../styles/orange-rain.css";

let uid = 0;

// Cai uma laranja para cada doação disponível no site (vencidas não contam).
function contarDoacoesDisponiveis() {
    return getDoacoes().filter((doacao) => statusDaDoacao(doacao) === "Disponível").length;
}

function makeDrops(quantidade) {
    return Array.from({ length: quantidade }, () => ({
        id: uid++,
        left: Math.random() * 100,            // posição horizontal (vw)
        size: 22 + Math.random() * 30,        // tamanho (px)
        duration: 1.8 + Math.random() * 1.6,  // tempo da queda (s)
        delay: Math.random() * 0.8,           // atraso para não caírem todas juntas (s)
        drift: (Math.random() - 0.5) * 160,   // deslocamento lateral (px)
        rot: (Math.random() - 0.5) * 720,     // rotação total (graus)
    }));
}

// Classes de cada parte da nuvem: surgem quando o mouse chega perto ou quando o botão
// recebe foco pelo teclado. Usa :focus-visible (e não :focus) porque o clique do mouse
// também dá foco ao botão, e aí a nuvem ficaria presa na tela depois de clicar.
const APARECER = "opacity-0 scale-50 transition duration-300 ease-out group-hover:opacity-100 group-hover:scale-100 group-has-[:focus-visible]:opacity-100 group-has-[:focus-visible]:scale-100";

/*
 * Formato da nuvem: vários círculos de tamanhos diferentes sobre uma elipse.
 * Gomos grandes em cima, médios nas laterais e pequenos embaixo, como uma nuvem de desenho.
 * [cx, cy, raio] no espaço 260 x 160 do SVG.
 */
const GOMOS_NUVEM = [
    // topo
    [64, 68, 32], [106, 46, 40], [158, 42, 42], [204, 66, 34],
    // laterais
    [32, 96, 27], [230, 98, 26],
    // base
    [66, 122, 24], [112, 130, 26], [160, 130, 25], [206, 120, 23],
];

// Balão de pensamento que "sai" da laranja: duas bolinhas e depois a nuvem.
function NuvemPensamento() {
    return (
        // Fica acima da laranja, no canto livre da tela, para não cobrir o texto do topo
        // mesmo na menor tela em que a laranja aparece (1536px).
        <div aria-hidden="true" className="pointer-events-none absolute bottom-full left-[54%] z-10 w-52">
            {/* bolinhas, da menor (logo acima da borda da laranja) para a maior */}
            <span className={`absolute -bottom-[5px] left-[39px] h-2.5 w-2.5 rounded-full bg-white shadow-card ${APARECER}`} />
            <span className={`absolute bottom-[6px] left-[20px] h-4 w-4 rounded-full bg-white shadow-card delay-75 ${APARECER}`} />

            <div className={`origin-bottom-left delay-150 ${APARECER}`}>
                <div className="nuvem-flutuar relative">
                    {/* a sombra é aplicada no SVG inteiro, então os gomos se fundem numa silhueta só */}
                    <svg viewBox="0 0 260 160" className="block w-full drop-shadow-[0_10px_16px_rgba(42,42,36,0.16)]">
                        <g fill="white">
                            <ellipse cx="130" cy="92" rx="104" ry="46" />
                            {GOMOS_NUVEM.map(([cx, cy, r]) => (
                                <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} />
                            ))}
                        </g>
                    </svg>

                    <p className="absolute inset-0 flex items-center justify-center px-8 pt-2 text-center font-heading text-sm font-semibold leading-snug text-forest-dark">
                        Saiba quantas doações já realizamos
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function OrangeRain({ className = "" }) {
    const [drops, setDrops] = useState([]);
    const [spinKey, setSpinKey] = useState(0);

    const handleClick = () => {
        setSpinKey((k) => k + 1); // muda a key da imagem para reiniciar o giro a cada clique

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const batch = makeDrops(contarDoacoesDisponiveis());
        setDrops((current) => [...current, ...batch]);

        // remove as laranjas depois que terminam de cair
        setTimeout(() => {
            const ids = new Set(batch.map((d) => d.id));
            setDrops((current) => current.filter((d) => !ids.has(d.id)));
        }, 4500);
    };

    return (
        <>
            {/* "group": a nuvem aparece ao passar o mouse em qualquer parte deste bloco */}
            <div className={`group z-20 ${className}`}>
                {/* área invisível ao redor da laranja: a nuvem surge quando o mouse chega perto */}
                <div aria-hidden="true" className="absolute -inset-16 rounded-full" />

                <button
                    type="button"
                    onClick={handleClick}
                    aria-label="Fazer chover laranjas: uma para cada doação disponível"
                    className="relative h-full w-full cursor-pointer transition-transform duration-200 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-terracotta"
                >
                    <img
                        key={spinKey}
                        src={laranja}
                        alt=""
                        draggable="false"
                        className={`h-full w-full select-none object-contain ${spinKey ? "orange-spin" : ""}`}
                    />
                </button>

                <NuvemPensamento />
            </div>

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
