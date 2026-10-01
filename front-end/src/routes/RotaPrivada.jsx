import { useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUsuarioLogado } from "../hooks/useUsuarioLogado";

/*
 * Protege as rotas filhas: quem não está logado vai para /login.
 * Se "tiposPermitidos" for informado, só esses tipos de usuário entram;
 * os demais voltam para a página inicial.
 * Acompanha a sessão: quem sai da conta com a página aberta vai para a página inicial
 * (e não para o login, que só faz sentido para quem chegou aqui sem estar logado).
 */
function RotaPrivada({ tiposPermitidos }) {
    const usuario = useUsuarioLogado();
    const location = useLocation();
    const [entrouLogado] = useState(() => Boolean(usuario));

    if (!usuario && entrouLogado) {
        return <Navigate to="/" replace />;
    }

    if (!usuario) {
        // Guarda a página que a pessoa tentou abrir para voltar a ela depois do login.
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    if (tiposPermitidos && !tiposPermitidos.includes(usuario.tipo)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}

export default RotaPrivada;
