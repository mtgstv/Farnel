import { Link } from "react-router-dom";
import HeroLogado from "../../components/HomeLogado/HeroLogado";
import ResumoUsuario from "../../components/HomeLogado/ResumoUsuario";
import DoacoesDisponiveis from "../../components/HomeLogado/DoacoesDisponiveis";
import { ArrowIcon } from "../../components/Comuns/Icons";
import { getDoacoes } from "../../services/doacoesStorage";
import { getFavoritos } from "../../services/favoritosStorage";

// Página inicial de quem está logado. A Home decide qual versão mostrar.
function HomeLogado({ usuario }) {
    const doacoes = getDoacoes();

    // Mais recentes primeiro (o id é a data de criação).
    const minhasDoacoes = doacoes
        .filter((doacao) => doacao.usuarioId === usuario.id)
        .sort((a, b) => b.id - a.id);

    return (
        <main>
            <HeroLogado usuario={usuario} minhasDoacoes={minhasDoacoes} />
            <ResumoUsuario minhasDoacoes={minhasDoacoes} totalFavoritos={getFavoritos().length} />
            <DoacoesDisponiveis doacoes={doacoes} />

            <section className="container-page pb-20 md:pb-24">
                <div className="rounded-[2rem] bg-forest px-8 py-14 text-center sm:px-14 sm:py-16">
                    <h2 className="text-2xl font-semibold text-cream sm:text-3xl">
                        Sobrou alimento por aí?
                    </h2>
                    <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-cream/90 sm:text-base">
                        Cadastrar uma doação leva poucos minutos e pode garantir a próxima refeição de alguém.
                    </p>
                    <Link to="/doacoes/nova" className="btn-primary mt-8">
                        Cadastrar nova doação
                        <ArrowIcon className="h-4 w-4" />
                    </Link>
                </div>
            </section>
        </main>
    );
}

export default HomeLogado;
