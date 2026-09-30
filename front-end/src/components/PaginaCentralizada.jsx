/*
 * Página de conteúdo centralizado com título: formulários (entrar, cadastro,
 * cadastrar doação, solicitar doação) e páginas simples (404, em construção).
 * - largura: classe de largura máxima do conteúdo (ex.: "max-w-lg", "max-w-3xl")
 */
function PaginaCentralizada({ eyebrow, titulo, descricao, largura = "max-w-3xl", children }) {
    return (
        <main className="min-h-[70vh] bg-cream py-12 md:py-16">
            <div className="container-page">
                <div className={`mx-auto ${largura}`}>
                    <header className="mb-8 text-center">
                        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
                        <h1 className="text-3xl md:text-4xl">{titulo}</h1>
                        {descricao && (
                            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ink-soft">{descricao}</p>
                        )}
                    </header>

                    {children}
                </div>
            </div>
        </main>
    );
}

export default PaginaCentralizada;
