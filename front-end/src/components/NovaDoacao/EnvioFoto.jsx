import { useState } from "react";
import { CameraIcon } from "../Comuns/Icons";

/*
 * Área para enviar a foto do alimento: clicar ou arrastar um arquivo.
 * Mostra o carregamento enquanto a foto é comprimida e, depois, a prévia com "Trocar" e "Remover".
 * O <input type="file"> fica sempre na página (escondido) para o "Trocar foto" funcionar.
 */
function EnvioFoto({ imagem, carregando, erro, onArquivo, onRemover }) {
    const [arrastando, setArrastando] = useState(false);

    function handleChange(event) {
        const arquivo = event.target.files[0];
        event.target.value = ""; // permite escolher o mesmo arquivo de novo
        if (arquivo) onArquivo(arquivo);
    }

    function handleDrop(event) {
        event.preventDefault();
        setArrastando(false);
        const arquivo = event.dataTransfer.files[0];
        if (arquivo) onArquivo(arquivo);
    }

    const eventosArrastar = {
        onDragOver: (event) => {
            event.preventDefault();
            setArrastando(true);
        },
        onDragLeave: () => setArrastando(false),
        onDrop: handleDrop,
    };

    return (
        <div className="flex flex-col gap-2">
            <p className="rotulo">
                Foto do alimento <span className="font-normal text-ink-soft">(opcional)</span>
            </p>

            <input
                type="file"
                id="imagem"
                accept="image/*"
                onChange={handleChange}
                disabled={carregando}
                aria-invalid={Boolean(erro)}
                aria-describedby={erro ? "imagem-erro" : imagem || carregando ? undefined : "imagem-dica"}
                className="peer sr-only"
            />

            {imagem ? (
                <div className="relative overflow-hidden rounded-2xl" {...eventosArrastar}>
                    <img src={imagem} alt="Foto escolhida para a doação" className="aspect-[16/9] w-full object-cover" />
                    <div className="absolute inset-x-0 bottom-0 flex flex-wrap justify-end gap-2 bg-gradient-to-t from-black/60 to-transparent p-4 pt-10">
                        <label htmlFor="imagem" className="btn-outline-light btn-sm cursor-pointer bg-black/20 backdrop-blur-sm">
                            Trocar foto
                        </label>
                        <button type="button" onClick={onRemover} className="btn-outline-light btn-sm bg-black/20 backdrop-blur-sm">
                            Remover
                        </button>
                    </div>
                    {arrastando && (
                        <div className="absolute inset-0 flex items-center justify-center bg-forest/80 text-sm font-semibold text-white">
                            Solte para trocar a foto
                        </div>
                    )}
                </div>
            ) : (
                <label
                    htmlFor="imagem"
                    {...eventosArrastar}
                    className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition peer-focus-visible:ring-2 peer-focus-visible:ring-forest/30 ${arrastando
                        ? "border-forest bg-forest/5"
                        : erro
                            ? "border-terracotta-dark/50 bg-terracotta/5"
                            : "border-line bg-cream hover:border-forest/50 hover:bg-white"
                        }`}
                >
                    {carregando ? (
                        <>
                            <span className="h-10 w-10 animate-spin rounded-full border-4 border-forest/15 border-t-forest" />
                            <span role="status" className="text-sm font-semibold text-forest-dark">Preparando a foto...</span>
                        </>
                    ) : (
                        <>
                            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-forest-dark shadow-soft">
                                <CameraIcon className="h-7 w-7" />
                            </span>
                            <span className="text-sm font-semibold text-ink">
                                {arrastando ? "Solte a foto aqui" : (
                                    <>
                                        <span className="text-forest-dark underline underline-offset-2">Escolha uma foto</span> ou arraste para cá
                                    </>
                                )}
                            </span>
                            <span id="imagem-dica" className="text-xs text-ink-soft">
                                JPG ou PNG, até 10 MB. Doações com foto costumam ser solicitadas mais rápido.
                            </span>
                        </>
                    )}
                </label>
            )}

            {erro && (
                <p id="imagem-erro" className="text-sm text-terracotta-dark">
                    {erro}
                </p>
            )}
        </div>
    );
}

export default EnvioFoto;
