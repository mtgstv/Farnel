import { Component } from "react";

/*
 * Se alguma página quebrar durante a renderização, mostra esta tela em vez da tela em branco.
 * Precisa ser um componente de classe: o React só oferece "error boundaries" assim.
 * Fica fora do roteador, então usa <a> comum (recarrega a página) em vez de <Link>.
 */
class LimiteDeErro extends Component {
    state = { erro: null };

    static getDerivedStateFromError(erro) {
        return { erro };
    }

    render() {
        if (!this.state.erro) return this.props.children;

        return (
            <main className="flex min-h-screen items-center justify-center bg-cream px-6 py-16">
                <div className="cartao max-w-md p-8 text-center sm:p-10">
                    <p className="eyebrow">Algo deu errado</p>
                    <h1 className="mt-3 text-2xl font-semibold sm:text-3xl">Não foi possível mostrar esta página</h1>
                    <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                        Tente recarregar. Se o problema continuar, volte para a página inicial.
                    </p>
                    <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                        <button type="button" onClick={() => window.location.reload()} className="btn-primary">
                            Recarregar
                        </button>
                        <a href="/" className="btn-outline">Página inicial</a>
                    </div>
                </div>
            </main>
        );
    }
}

export default LimiteDeErro;
