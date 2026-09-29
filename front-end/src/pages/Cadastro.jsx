import CadastroForm from "../components/Cadastro/CadastroForm";

function Cadastro() {
    return (
        <main className="min-h-screen bg-cream py-12 md:py-20">
            <div className="container-page">
                <div className="mx-auto max-w-lg rounded-3xl bg-white p-8 shadow-card md:p-10">
                    <div className="mb-8 text-center">
                        <p className="eyebrow mb-3">
                            Crie sua conta
                        </p>

                        <h1 className="text-3xl md:text-4xl">
                            Cadastre-se no Farnel
                        </h1>

                        <p className="mt-3 text-sm text-ink-soft">
                            Preencha seus dados para criar sua conta.
                        </p>
                    </div>

                    <CadastroForm />
                </div>
            </div>
        </main>
    );
}

export default Cadastro;