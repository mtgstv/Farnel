import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import PaginaCentralizada from "../../components/Layout/PaginaCentralizada";
import CampoSenha from "../../components/Formulario/CampoSenha";
import { Campo } from "../../components/Formulario/Formulario";
import { useDestinoAposLogin } from "../../hooks/useDestinoAposLogin";
import { useAuth } from "../../hooks/useAuth";

function Login() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [enviando, setEnviando] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const destino = useDestinoAposLogin();
    const { usuario: jaLogado, entrar } = useAuth();

    // Quem já está logado não precisa entrar de novo.
    if (jaLogado) return <Navigate to={destino} replace />;

    async function handleSubmit(event) {
        event.preventDefault();

        if (!email.trim() || !senha) {
            setErro("Preencha o e-mail e a senha.");
            return;
        }

        setErro("");
        setEnviando(true);
        try {
            await entrar({ email: email.trim(), senha });
            navigate(destino, { replace: true });
        } catch (erroApi) {
            // A API explica o motivo: e-mail ou senha incorretos (401), muitas tentativas (429)
            // ou servidor fora do ar (status 0)
            setErro(erroApi.message);
            setEnviando(false);
        }
    }

    return (
        <PaginaCentralizada
            eyebrow="Bem-vindo de volta"
            titulo="Entrar no Farnel"
            descricao="Conectando solidariedade e combate ao desperdício."
            largura="max-w-md"
        >
            <div className="cartao p-6 sm:p-8">
                <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                    {erro && (
                        <p role="alert" className="aviso-erro">
                            {erro}
                        </p>
                    )}

                    <Campo id="email" rotulo="E-mail">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="seu.email@exemplo.com"
                            autoComplete="email"
                            className="campo"
                        />
                    </Campo>

                    <Campo id="senha" rotulo="Senha">
                        <CampoSenha
                            id="senha"
                            name="senha"
                            value={senha}
                            onChange={(event) => setSenha(event.target.value)}
                            autoComplete="current-password"
                        />
                    </Campo>

                    <button type="submit" className="btn-primary mt-1 w-full" disabled={enviando}>
                        {enviando ? "Entrando..." : "Entrar"}
                    </button>
                </form>

                <p className="mt-6 border-t border-line pt-5 text-center text-sm text-ink-soft">
                    Ainda não tem uma conta?{" "}
                    {/* repassa a página de origem: depois do cadastro, a pessoa volta para ela */}
                    <Link to="/cadastro" state={location.state} className="font-semibold text-forest-dark hover:underline">
                        Cadastre-se
                    </Link>
                </p>
            </div>
        </PaginaCentralizada>
    );
}

export default Login;
