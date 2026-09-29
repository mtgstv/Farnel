import fatiaum from "../assets/fatia1.png";
import fatiadois from "../assets/fatia2.png";
import fatiatres from "../assets/fatia3.png";

const ITEMS = [
    // cima à direita
    { img: fatiaum, pos: "right-[5%] top-28", size: "h-28 w-28", rot: "18deg", delay: "0.2s", float: "6s" },
    // baixo à direita
    { img: fatiadois, pos: "right-[7%] bottom-14", size: "h-40 w-40", rot: "-12deg", delay: "0.5s", float: "7s" },
    // baixo à esquerda
    { img: fatiatres, pos: "left-[6%] bottom-16", size: "h-32 w-32", rot: "25deg", delay: "0.8s", float: "5.5s" },
];

export default function FloatingOranges() {
    return (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 hidden xl:block">
            {ITEMS.map((o, i) => (
                <div
                    key={i}
                    className={`float-orange absolute ${o.pos} ${o.size}`}
                    style={{ animationDelay: o.delay }}
                >
                    <img
                        src={o.img}
                        alt=""
                        draggable="false"
                        className="h-full w-full object-contain drop-shadow-md"
                        style={{ "--rot": o.rot, animationDuration: o.float }}
                    />
                </div>
            ))}
        </div>
    );
}