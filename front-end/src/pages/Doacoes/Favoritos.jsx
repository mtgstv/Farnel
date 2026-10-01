import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FaixaTopo from "../../components/Layout/FaixaTopo";
import FundoPagina from "../../components/Layout/FundoPagina";
import EstadoVazio from "../../components/Comuns/EstadoVazio";
import DoacaoCard from "../../components/Doacoes/DoacaoCard";
import ModalDoacao from "../../components/Doacoes/ModalDoacao";
import { ArrowIcon } from "../../components/Comuns/Icons";
import { EVENTO_FAVORITOS_ALTERADOS, getFavoritos } from "../../services/favoritosStorage";
import { getDoacoes } from "../../services/doacoesStorage";

/*
 * Os favoritos guardam uma cópia da doação do momento em que foram salvos; aqui usamos
 * a versão atual de cada uma (status, foto...), e a cópia só se a doação não existir mais.
 */
function lerFavoritos() {
    const atuais = new Map(getDoacoes().map((doacao) => [doacao.id, doacao]));
    return getFavoritos().map((favorito) => atuais.get(favorito.id) ?? favorito);
}

function Favoritos() {
    const [favoritos, setFavoritos] = useState(lerFavoritos);
    const [doacaoSelecionada, setDoacaoSelecionada] = useState(null);

    // Ao desfavoritar pelo card, a doação sai da lista na hora.
    useEffect(() => {
        function atualizar() {
            setFavoritos(lerFavoritos());
        }

        window.addEventListener(EVENTO_FAVORITOS_ALTERADOS, atualizar);
        return () => window.removeEventListener(EVENTO_FAVORITOS_ALTERADOS, atualizar);
    }, []);

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
                    {favoritos.length === 0 ? (
                        <EstadoVazio
                            eyebrow="Nenhum favorito ainda"
                            titulo="Sua lista está vazia"
                            texto="Toque em “♡ Adicionar aos favoritos” em qualquer doação para guardá-la aqui."
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
