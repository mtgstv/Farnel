import { useState } from "react";
import { Link } from "react-router-dom";
import FaixaTopo from "../../components/Layout/FaixaTopo";
import FundoPagina from "../../components/Layout/FundoPagina";
import EstadoVazio from "../../components/Comuns/EstadoVazio";
import { Carregando, ErroAoCarregar } from "../../components/Comuns/EstadoRequisicao";
import DoacaoCard from "../../components/Doacoes/DoacaoCard";
import ModalDoacao from "../../components/Doacoes/ModalDoacao";
import { ArrowIcon } from "../../components/Comuns/Icons";
import { useFavoritos } from "../../hooks/useFavoritos";

// As doações favoritas da conta (vêm da API pelo FavoritosProvider). Ao desfavoritar um card, ele sai da lista na hora.
function Favoritos() {
    const { favoritos, carregando, erro, recarregar } = useFavoritos();
    const [doacaoSelecionada, setDoacaoSelecionada] = useState(null);

    return (
        <div className="min-h-screen">
            <FaixaTopo
                eyebrow="Minha lista"
                titulo="Favoritos"
                descricao="As doações que você salvou para acompanhar de perto."
                acao={
                    <Link to="/doacoes" className="btn-primary">
                        Ver doações
                        <ArrowIcon className="h-4 w-4" />
                    </Link>
                }
            />

            <FundoPagina>
                <main className="container-largo py-10 md:py-14">
                    {erro ? (
                        <ErroAoCarregar erro={erro} onTentarNovamente={recarregar} titulo="Não foi possível carregar os favoritos" />
                    ) : carregando ? (
                        <Carregando texto="Carregando favoritos..." />
                    ) : favoritos.length === 0 ? (
                        <EstadoVazio
                            eyebrow="Nenhum favorito ainda"
                            titulo="Sua lista está vazia"
                            texto="Toque no ♡ de qualquer doação para guardá-la aqui."
                            acao={<Link to="/doacoes" className="btn-primary">Explorar doações</Link>}
                        />
                    ) : (
                        <>
                            <p className="mb-6 text-sm font-medium text-ink-soft">
                                {favoritos.length} {favoritos.length === 1 ? "doação salva" : "doações salvas"}
                            </p>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {favoritos.map((doacao) => (
                                    <DoacaoCard key={doacao.id} doacao={doacao} onVerDetalhes={setDoacaoSelecionada} />
                                ))}
                            </div>
                        </>
                    )}
                </main>
            </FundoPagina>

            {doacaoSelecionada && (
                <ModalDoacao doacao={doacaoSelecionada} onFechar={() => setDoacaoSelecionada(null)} />
            )}
        </div>
    );
}

export default Favoritos;
