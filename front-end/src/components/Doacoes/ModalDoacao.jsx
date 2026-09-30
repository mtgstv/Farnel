import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import FotoDoacao from "./FotoDoacao";
import SeloStatus from "./SeloStatus";
import InfoItem from "../InfoItem";
import { statusDaDoacao } from "../../services/ordenacaoDoacoes";
import { getUsuarioLogado } from "../../services/authStorage";

/*
 * Janela com o resumo de uma doação, aberta a partir dos cards.
 * Fecha com Esc, clicando fora ou no ×; enquanto aberta, a página de trás não rola.
 */
function ModalDoacao({ doacao, onFechar }) {
    const botaoFecharRef = useRef(null);
    // A página pode recriar onFechar a cada render; guardado aqui, o efeito abaixo roda só ao abrir.
    const fecharRef = useRef(onFechar);
    useEffect(() => {
        fecharRef.current = onFechar;
    });

    // "Vencida" é calculada pela validade; as outras vêm do status salvo.
    const status = statusDaDoacao(doacao);
    const podeSolicitar = status === "Disponível" && doacao.usuarioId !== getUsuarioLogado()?.id;

    useEffect(() => {
        const focoAnterior = document.activeElement;
        const rolagemAnterior = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        botaoFecharRef.current?.focus();

        function handleKeyDown(event) {
            if (event.key === "Escape") fecharRef.current();
        }
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = rolagemAnterior;
            focoAnterior?.focus?.(); // devolve o foco para onde estava (ex.: o botão do card)
        };
    }, []);

    return (
        <div
            className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/55 p-0 backdrop-blur-[2px] sm:items-center sm:p-4"
            // clicar no fundo escuro (e não dentro da janela) fecha
            onMouseDown={(event) => event.target === event.currentTarget && onFechar()}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-doacao-titulo"
                className="relative max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
            >
                <div className="relative">
                    <FotoDoacao doacao={doacao} prioritaria className="h-48 w-full sm:h-56" />
                    <SeloStatus status={status} sobreFoto className="absolute left-4 top-4" />
                    <button
                        ref={botaoFecharRef}
                        type="button"
                        onClick={onFechar}
                        aria-label="Fechar"
                        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-xl leading-none text-ink shadow-card transition hover:bg-white"
                    >
                        ×
                    </button>
                </div>

                <div className="p-6">
                    <p className="rotulo-categoria">{doacao.categoria}</p>
                    <h2 id="modal-doacao-titulo" className="mt-1.5 text-2xl font-semibold">
                        {doacao.titulo}
                    </h2>
                    {doacao.descricao && (
                        <p className="mt-3 text-sm leading-relaxed text-ink-soft">{doacao.descricao}</p>
                    )}

                    <dl className="mt-5 grid grid-cols-2 gap-4 rounded-2xl bg-cream p-4">
                        <InfoItem rotulo="Quantidade">{doacao.quantidade}</InfoItem>
                        <InfoItem rotulo="Validade">{doacao.validade}</InfoItem>
                        <InfoItem rotulo="Local">{doacao.local}</InfoItem>
                        <InfoItem rotulo="Retirada">{doacao.tipoRetirada}</InfoItem>
                        {doacao.conservacao && <InfoItem rotulo="Conservação">{doacao.conservacao}</InfoItem>}
                        {doacao.alergenicos?.length > 0 && (
                            <InfoItem rotulo="Alergênicos">{doacao.alergenicos.join(", ")}</InfoItem>
                        )}
                    </dl>

                    {doacao.observacoes && (
                        <p className="mt-4 text-sm text-ink-soft">
                            <span className="font-semibold text-ink">Observações:</span> {doacao.observacoes}
                        </p>
                    )}

                    <div className="mt-5 flex items-center justify-between gap-4 border-t border-line pt-4 text-sm">
                        <div>
                            <p className="font-semibold text-ink">{doacao.doador}</p>
                            <p className="text-ink-soft">{doacao.contato}</p>
                        </div>
                    </div>

                    <div className="mt-5 flex flex-col gap-2 sm:flex-row-reverse">
                        {podeSolicitar && (
                            <Link to={`/solicitacoes/nova?doacao=${doacao.id}`} className="btn-primary btn-sm sm:flex-1">
                                Solicitar doação
                            </Link>
                        )}
                        <Link to={`/detalhes/${doacao.id}`} className="btn-secundario btn-sm sm:flex-1">
                            Ver página completa
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalDoacao;
