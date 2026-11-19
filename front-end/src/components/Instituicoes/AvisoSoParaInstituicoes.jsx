import { Link } from "react-router-dom";
import EstadoVazio from "../Comuns/EstadoVazio";

// Mostrado nas páginas da área da instituição para quem não participa como "ONG ou instituição"
function AvisoSoParaInstituicoes() {
    return (
        <EstadoVazio
            eyebrow="Área das instituições"
            titulo="Esta página é para ONGs e cozinhas solidárias"
            texto="Se você representa uma instituição, escolha “ONG ou instituição” em “Você participa como”, no seu perfil. Os seus pedidos continuam em Solicitações."
            acao={
                <div className="flex flex-col justify-center gap-3 sm:flex-row">
                    <Link to="/perfil" className="btn-primary">Abrir meu perfil</Link>
                    <Link to="/solicitacoes" className="btn-outline">Ver meus pedidos</Link>
                </div>
            }
        />
    );
}

export default AvisoSoParaInstituicoes;
