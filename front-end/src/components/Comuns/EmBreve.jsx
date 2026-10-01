import { Link } from "react-router-dom";
import EstadoVazio from "./EstadoVazio";

// Placeholder temporário para páginas que ainda não foram desenvolvidas.
function EmBreve({ titulo }) {
    return (
        <main className="container-page min-h-[60vh] py-16">
            <EstadoVazio
                eyebrow="Em construção"
                titulo={titulo}
                tituloDaPagina
                texto="Esta página ainda está sendo desenvolvida. Enquanto isso, que tal ver as doações disponíveis?"
                acao={
                    <div className="flex flex-col justify-center gap-3 sm:flex-row">
                        <Link to="/doacoes" className="btn-primary">Ver doações</Link>
                        <Link to="/" className="btn-outline">Página inicial</Link>
                    </div>
                }
            />
        </main>
    );
}

export default EmBreve;
