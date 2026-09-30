import { Link } from "react-router-dom";

export default function NaoEncontrada() {
    return (
        <main className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-16 text-center">
            <p className="font-heading text-8xl font-semibold text-forest/15" aria-hidden="true">404</p>
            <h1 className="-mt-6 text-3xl font-semibold md:text-4xl">Página não encontrada</h1>
            <p className="mt-3 max-w-md text-ink-soft">
                O endereço pode ter mudado ou não existir mais. Que tal voltar e continuar de onde parou?
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/" className="btn-primary">Página inicial</Link>
                <Link to="/doacoes" className="btn-outline">Ver doações</Link>
            </div>
        </main>
    );
}
