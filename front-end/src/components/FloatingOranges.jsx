import fatiaum from "../assets/fatia1.png";
import fatiadois from "../assets/fatia2.png";
import fatiatres from "../assets/fatia3.png";
import "../styles/floating-oranges.css";

// Posições no topo das homes (hero)
const ITENS_HERO = [
    // cima à direita
    { img: fatiaum, pos: "right-[5%] top-28", size: "h-28 w-28", rot: "18deg", delay: "0.2s", float: "6s" },
    // baixo à direita
    { img: fatiadois, pos: "right-[7%] bottom-14", size: "h-40 w-40", rot: "-12deg", delay: "0.5s", float: "7s" },
    // baixo à esquerda
    { img: fatiatres, pos: "left-[6%] bottom-16", size: "h-32 w-32", rot: "25deg", delay: "0.8s", float: "5.5s" },
];

// Posições espalhadas ao longo de uma página comprida (ex.: lista de doações)
const ITENS_PAGINA = [
    { img: fatiadois, pos: "right-[2%] top-[18%]", size: "h-36 w-36", rot: "-12deg", delay: "0.5s", float: "7s" },
    { img: fatiatres, pos: "left-[2%] top-[50%]", size: "h-28 w-28", rot: "25deg", delay: "0.8s", float: "5.5s" },
    { img: fatiaum, pos: "right-[3%] top-[80%]", size: "h-24 w-24", rot: "-20deg", delay: "0.3s", float: "6.5s" },
];

const VARIANTES = { hero: ITENS_HERO, pagina: ITENS_PAGINA };

/*
 * Fatias de laranja flutuando no fundo.
 * - variante: "hero" (topo das homes) ou "pagina" (espalhadas numa página comprida)
 * - suave: mais desfocadas e transparentes, para não disputar atenção com o conteúdo
 */
export default function FloatingOranges({ variante = "hero", suave = false }) {
    return (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 hidden xl:block">
            {VARIANTES[variante].map((o, i) => (
                <div
                    key={i}
                    className={`float-orange absolute ${o.pos} ${o.size}`}
                    style={{ animationDelay: o.delay }}
                >
                    {/* o efeito suave fica na imagem: a animação de entrada do bloco termina em opacity 1 */}
                    <img
                        src={o.img}
                        alt=""
                        draggable="false"
                        className={`h-full w-full object-contain ${suave ? "opacity-25 blur-[3px]" : "drop-shadow-md"}`}
                        style={{ "--rot": o.rot, animationDuration: o.float }}
                    />
                </div>
            ))}
        </div>
    );
}
