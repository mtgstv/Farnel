import { useState } from "react";
import DoacaoCard from "../components/Doacoes/DoacaoCard";
import {
    getFavoritos,
    removerFavorito,
} from "../services/favoritosStorage";

function Favoritos() {
    const [favoritos, setFavoritos] = useState(getFavoritos());

    function handleRemoverFavorito(id) {
        removerFavorito(id);
        setFavoritos(getFavoritos());
    }

    return (
        <main className="min-h-screen bg-cream py-12 md:py-20">
            <div className="container-page">
                <div className="mx-auto max-w-6xl">
                    <p className="eyebrow mb-3">
                        Meus favoritos
                    </p>

                    <h1 className="text-3xl md:text-4xl">
                        Favoritos
                    </h1>

                    <p className="mt-3 text-ink-soft">
                        Aqui estão as doações que você marcou como favoritas.
                    </p>

                    {favoritos.length === 0 ? (
                        <div className="mt-10 rounded-2xl bg-white p-8 text-center shadow-card">
                            <h2 className="text-xl font-bold">
                                Nenhum favorito ainda
                            </h2>

                            <p className="mt-2 text-sm text-ink-soft">
                                Quando você marcar uma doação como favorita,
                                ela aparecerá aqui.
                            </p>
                        </div>
                    ) : (
                        <section className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {favoritos.map((doacao) => (
                                <div key={doacao.id}>
                                    <DoacaoCard doacao={doacao} />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRemoverFavorito(doacao.id)
                                        }
                                        className="mt-3 w-full rounded-xl border border-line bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:border-terracotta hover:text-terracotta"
                                    >
                                        Remover dos favoritos
                                    </button>
                                </div>
                            ))}
                        </section>
                    )}
                </div>
            </div>
        </main>
    );
}

export default Favoritos;