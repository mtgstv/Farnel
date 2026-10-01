import { useEffect, useState } from "react";
import { EVENTO_FALHA_AO_SALVAR } from "../../services/armazenamento";
import { AlertIcon } from "../Comuns/Icons";

const DURACAO_MS = 8000;

/*
 * Aviso flutuante mostrado quando algo não pôde ser salvo no navegador
 * (normalmente, armazenamento cheio por causa das fotos das doações).
 */
function AvisoArmazenamento() {
    const [visivel, setVisivel] = useState(false);

    useEffect(() => {
        let temporizador;

        function mostrar() {
            setVisivel(true);
            clearTimeout(temporizador);
            temporizador = setTimeout(() => setVisivel(false), DURACAO_MS);
        }

        window.addEventListener(EVENTO_FALHA_AO_SALVAR, mostrar);
        return () => {
            window.removeEventListener(EVENTO_FALHA_AO_SALVAR, mostrar);
            clearTimeout(temporizador);
        };
    }, []);

    if (!visivel) return null;

    return (
        <div
            role="alert"
            className="fixed inset-x-4 bottom-4 z-[60] mx-auto flex max-w-md items-start gap-3 rounded-2xl bg-ink px-5 py-4 text-sm text-white shadow-card sm:bottom-6"
        >
            <AlertIcon className="mt-0.5 h-5 w-5 flex-none text-terracotta-light" />
            <div className="flex-1">
                <p className="font-semibold">Não foi possível salvar.</p>
                <p className="mt-0.5 text-white/85">
                    O armazenamento do navegador está cheio. Remova fotos de doações antigas e tente de novo.
                </p>
            </div>
            <button
                type="button"
                onClick={() => setVisivel(false)}
                aria-label="Fechar aviso"
                className="flex-none rounded-full px-2 text-lg leading-none text-white/85 hover:bg-white/10"
            >
                ×
            </button>
        </div>
    );
}

export default AvisoArmazenamento;
