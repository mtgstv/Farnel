import FloatingOranges from "./FloatingOranges";

// Fundo das páginas de listagem: o mesmo pontilhado da home e fatias de laranja bem suaves.
// overflow-clip (e não hidden) corta as laranjas sem impedir elementos "sticky" dentro da página.
function FundoPagina({ children }) {
    return (
        <div className="relative isolate overflow-clip">
            <div aria-hidden="true" className="dot-grid dot-grid-pagina pointer-events-none absolute inset-0 -z-10 opacity-40" />
            <FloatingOranges variante="pagina" suave />
            {children}
        </div>
    );
}

export default FundoPagina;
