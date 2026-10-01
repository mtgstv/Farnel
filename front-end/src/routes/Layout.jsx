import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import HeaderNavegacao from "../components/Layout/HeaderNavegacao";
import Footer from "../components/Layout/Footer";
import ControleRolagem from "./ControleRolagem";

// Mostrado enquanto a página (carregada sob demanda) é baixada; header e rodapé continuam na tela.
function CarregandoPagina() {
    return (
        <div role="status" className="flex min-h-[60vh] items-center justify-center">
            <span className="h-10 w-10 animate-spin rounded-full border-4 border-forest/15 border-t-forest" />
            <span className="sr-only">Carregando...</span>
        </div>
    );
}

// A home tem seu próprio Header, então usa comHeader={false}.
function Layout({ comHeader = true }) {
    return (
        <>
            <ControleRolagem />
            {comHeader && <HeaderNavegacao />}
            <Suspense fallback={<CarregandoPagina />}>
                <Outlet />
            </Suspense>
            <Footer />
        </>
    );
}

export default Layout;
