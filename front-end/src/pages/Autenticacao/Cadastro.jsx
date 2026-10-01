import { Link, Navigate, useLocation } from "react-router-dom";
import PaginaCentralizada from "../../components/Layout/PaginaCentralizada";
import CadastroForm from "../../components/Autenticacao/CadastroForm";
import { useDestinoAposLogin } from "../../hooks/useDestinoAposLogin";
import { useUsuarioLogado } from "../../hooks/useUsuarioLogado";

function Cadastro() {
    const location = useLocation();
    const destino = useDestinoAposLogin();

    const jaLogado = useUsuarioLogado();

    // Quem já está logado não precisa criar outra conta.
    if (jaLogado) return <Navigate to={destino} replace />;

    return (
        <PaginaCentralizada
            eyebrow="Crie sua conta"
            titulo="Cadastre-se no Farnel"
            descricao="Leva menos de um minuto: depois é só doar ou solicitar alimentos."
            largura="max-w-md"
        >
            <div className="cartao p-6 sm:p-8">
                <CadastroForm />

                <p className="mt-6 border-t border-line pt-5 text-center text-sm text-ink-soft">
                    Já tem uma conta?{" "}
                    <Link to="/login" state={location.state} className="font-semibold text-forest-dark hover:underline">
                        Entrar
                    </Link>
                </p>
            </div>
        </PaginaCentralizada>
    );
}

export default Cadastro;
