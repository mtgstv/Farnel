import imagemPadrao from "../../assets/ImgDescricao/imgtest.jpg";
import { CameraOffIcon } from "../Icons";

/*
 * Foto da doação. As doações sem foto guardam a imagem padrão (imgtest.jpg);
 * nesse caso mostramos o placeholder "sem imagem" no lugar.
 * - prioritaria: carrega na hora (foto principal da página); as demais só carregam
 *   quando chegam perto da tela, o que alivia as listas com muitas fotos.
 */
function FotoDoacao({ doacao, className = "", prioritaria = false }) {
    const temFoto = Boolean(doacao.imagem) && doacao.imagem !== imagemPadrao;

    if (!temFoto) {
        return (
            <div
                role="img"
                aria-label="Doação sem imagem"
                className={`flex flex-col items-center justify-center gap-2 bg-cream-dark text-ink-soft/70 ${className}`}
            >
                <CameraOffIcon className="h-12 w-12" />
                <span className="text-sm font-medium">sem imagem</span>
            </div>
        );
    }

    return (
        <img
            src={doacao.imagem}
            alt={doacao.titulo}
            loading={prioritaria ? "eager" : "lazy"}
            decoding="async"
            className={`object-cover ${className}`}
        />
    );
}

export default FotoDoacao;
