import { useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Carregando } from "../components/Comuns/EstadoRequisicao";
import { useAuth } from "../hooks/useAuth";

/*
 * Protege as rotas filhas: quem não está logado vai para /login (e volta para cá depois de entrar).
 * Se "tiposPermitidos" for informado, só esses tipos de usuário entram; os demais voltam para o início.
 * Quem sai da conta com a página aberta vai para a página inicial (e não para o login).
 * Isso só esconde as páginas: quem protege os dados de verdade é a API (401/403).
 */
function RotaPrivada({ tiposPermitidos }) {
    const { usuario, verificando } = useAuth();
    const location = useLocation();

    // Lembra se a pessoa já esteve logada nesta página (padrão do React para guardar algo de renders anteriores)
    const [jaEsteveLogado, setJaEsteveLogado] = useState(false);
    if (usuario && !jaEsteveLogado) {
        setJaEsteveLogado(true);
    }

    // Ao abrir o site (ou apertar F5), espera a API dizer se há um login salvo
    if (verificando) {
        return <Carregando texto="Verificando sua sessão..." />;
    }

    if (!usuario) {
        if (jaEsteveLogado) {
            return <Navigate to="/" replace />;
        }
        // Guarda a página que a pessoa tentou abrir para voltar a ela depois do login.
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    if (tiposPermitidos && !tiposPermitidos.includes(usuario.tipo)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}

export default RotaPrivada;
