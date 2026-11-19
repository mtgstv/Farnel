import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { adicionarFavorito, listarFavoritos, removerFavorito } from "../services/favoritosService";
import { FavoritosContext } from "./FavoritosContext";

const SEM_FAVORITOS = [];

/*
 * Guarda os favoritos de quem está logado, buscados uma vez na API, para que todos os corações
 * do site (cards, página da doação, página Favoritos) mostrem o mesmo estado.
 */
export default function FavoritosProvider({ children }) {
    const { usuario } = useAuth();
    const [estado, setEstado] = useState({ usuarioId: null, favoritos: SEM_FAVORITOS, erro: null });
    const [tentativa, setTentativa] = useState(0);

    useEffect(() => {
        if (!usuario) {
            return;
        }

        let ativo = true;
        listarFavoritos().then(
            (favoritos) => {
                if (ativo) setEstado({ usuarioId: usuario.id, favoritos, erro: null });
            },
            (erro) => {
                if (ativo) setEstado({ usuarioId: usuario.id, favoritos: SEM_FAVORITOS, erro });
            }
        );

        return () => {
            ativo = false;
        };
    }, [usuario, tentativa]);

    // Ao sair (ou trocar de conta), a lista antiga deixa de valer na hora
    const daConta = usuario != null && estado.usuarioId === usuario.id;
    const favoritos = daConta ? estado.favoritos : SEM_FAVORITOS;
    const erro = daConta ? estado.erro : null;
    const carregando = usuario != null && !daConta;

    const recarregar = useCallback(() => {
        setEstado((atual) => ({ ...atual, usuarioId: null }));
        setTentativa((atual) => atual + 1);
    }, []);

    const ids = useMemo(() => new Set(favoritos.map((doacao) => doacao.id)), [favoritos]);
    const ehFavorito = useCallback((doacaoId) => ids.has(doacaoId), [ids]);

    // Atualiza a tela na hora e desfaz se a API recusar (ex.: servidor fora do ar)
    const alternarFavorito = useCallback(
        async (doacao) => {
            const remover = ids.has(doacao.id);
            const semEla = (lista) => lista.filter((item) => item.id !== doacao.id);
            const comEla = (lista) => [doacao, ...semEla(lista)];

            setEstado((atual) => ({ ...atual, favoritos: remover ? semEla(atual.favoritos) : comEla(atual.favoritos) }));

            try {
                if (remover) {
                    await removerFavorito(doacao.id);
                } else {
                    await adicionarFavorito(doacao.id);
                }
            } catch (erroApi) {
                setEstado((atual) => ({ ...atual, favoritos: remover ? comEla(atual.favoritos) : semEla(atual.favoritos) }));
                throw erroApi;
            }
        },
        [ids]
    );

    const valor = useMemo(
        () => ({ favoritos, carregando, erro, recarregar, ehFavorito, alternarFavorito }),
        [favoritos, carregando, erro, recarregar, ehFavorito, alternarFavorito]
    );

    return <FavoritosContext value={valor}>{children}</FavoritosContext>;
}
