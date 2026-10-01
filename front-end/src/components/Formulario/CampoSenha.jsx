import { useState } from "react";

// Campo de senha com botão para mostrar/ocultar o que foi digitado.
// Aceita os mesmos atributos de um <input> (id, name, value, onChange, autoComplete...).
function CampoSenha(props) {
    const [visivel, setVisivel] = useState(false);

    return (
        <div className="relative">
            <input {...props} type={visivel ? "text" : "password"} className="campo pr-24" />
            <button
                type="button"
                onClick={() => setVisivel((valor) => !valor)}
                aria-label={visivel ? "Ocultar senha" : "Mostrar senha"}
                aria-pressed={visivel}
                className="absolute inset-y-1.5 right-1.5 rounded-lg px-3 text-xs font-semibold text-forest-dark transition hover:bg-cream-dark"
            >
                {visivel ? "Ocultar" : "Mostrar"}
            </button>
        </div>
    );
}

export default CampoSenha;
