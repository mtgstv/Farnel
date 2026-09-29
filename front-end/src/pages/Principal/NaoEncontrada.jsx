export default function NaoEncontrada() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
            <h1 className="text-6xl font-bold text-forest-dark">404</h1>
            <p className="mt-4 text-lg text-ink-soft">
                Ops! Essa página não existe.
            </p>
            <a href="/" className="btn-primary mt-6">
                Voltar para a página inicial
            </a>
        </div>
    );
}