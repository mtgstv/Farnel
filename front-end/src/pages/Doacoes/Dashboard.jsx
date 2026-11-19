import { Link } from "react-router-dom";
import FaixaTopo from "../../components/Layout/FaixaTopo";
import FundoPagina from "../../components/Layout/FundoPagina";
import { Carregando, ErroAoCarregar } from "../../components/Comuns/EstadoRequisicao";
import { ArrowIcon } from "../../components/Comuns/Icons";
import { Destaque, GraficoBarras, TotaisEntregues } from "../../components/Painel/Indicadores";
import { rotulosDePedido } from "../../components/Painel/rotulosDePedido";
import { useCarregar } from "../../hooks/useCarregar";
import { buscarPainel } from "../../services/painelService";

// "Meu painel": os números de quem está logado, contados pelo banco (GET /me/painel).

const somar = (itens) => itens.reduce((total, item) => total + item.total, 0);

function Dashboard() {
    const { dados: painel, erro, recarregar } = useCarregar(buscarPainel);

    return (
        <div className="min-h-screen">
            <FaixaTopo
                eyebrow="Dashboard"
                titulo="Meu painel"
                descricao="Os seus números no Farnel, contados a partir do que está guardado no banco."
                acao={
                    <Link to="/doacoes/nova" className="btn-primary">
                        Nova doação
                        <ArrowIcon className="h-4 w-4" />
                    </Link>
                }
            />

            <FundoPagina>
                <main className="container-largo py-10 md:py-14">
                    {erro ? (
                        <ErroAoCarregar erro={erro} onTentarNovamente={recarregar} titulo="Não foi possível carregar o painel" />
                    ) : !painel ? (
                        <Carregando texto="Carregando seus números..." />
                    ) : (
                        <Conteudo painel={painel} />
                    )}
                </main>
            </FundoPagina>
        </div>
    );
}

function Conteudo({ painel }) {
    const entregues = painel.doacoesPorStatus.find((item) => item.rotulo === "Concluída")?.total ?? 0;
    const pedidosFeitos = somar(painel.pedidosFeitos);
    const vazio = painel.totalDoacoes === 0 && pedidosFeitos === 0 && painel.favoritos === 0;

    return (
        <div className="flex flex-col gap-8">
            {vazio && (
                <div className="flex flex-col items-start gap-4 rounded-3xl bg-forest px-6 py-6 text-cream sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm">
                        Seu painel ainda está vazio. Cadastre uma doação ou peça uma para ver os números aparecerem aqui.
                    </p>
                    <Link to="/doacoes" className="btn-primary flex-none">Ver doações</Link>
                </div>
            )}

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
                <Destaque valor={painel.totalDoacoes} rotulo="Doações cadastradas" detalhe="Desde que você chegou" />
                <Destaque valor={entregues} rotulo="Doações entregues" detalhe="Já chegaram a quem precisa" />
                <Destaque valor={painel.pessoasAtendidas} rotulo="Pessoas atendidas" detalhe="Receberam suas doações" />
                <Destaque valor={pedidosFeitos} rotulo="Pedidos feitos" detalhe="Doações que você pediu" />
                <Destaque valor={painel.favoritos} rotulo="Favoritos" detalhe="Doações que você salvou" />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <GraficoBarras
                    titulo="Minhas doações por situação"
                    descricao="Vencida é a doação ainda ativa cuja validade já passou."
                    itens={painel.doacoesPorStatus}
                    vazio="Você ainda não cadastrou doações."
                />
                <GraficoBarras
                    titulo="Minhas doações por categoria"
                    itens={painel.doacoesPorCategoria}
                    vazio="Quando você cadastrar doações, as categorias aparecem aqui."
                />
                <TotaisEntregues
                    titulo="Quanto você já entregou"
                    descricao="Soma das doações marcadas como entregues, por unidade."
                    entregue={painel.entregue}
                    vazio="Quando uma doação sua for entregue, o total aparece aqui."
                />
                <GraficoBarras
                    titulo="Pedidos recebidos nas minhas doações"
                    itens={rotulosDePedido(painel.pedidosRecebidos)}
                    vazio="Suas doações ainda não receberam pedidos."
                />
                <GraficoBarras
                    titulo="Pedidos que eu fiz"
                    itens={rotulosDePedido(painel.pedidosFeitos)}
                    vazio="Você ainda não pediu nenhuma doação."
                />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
                <Link to="/minhas-doacoes" className="btn-outline">
                    Ver minhas doações
                    <ArrowIcon className="h-4 w-4" />
                </Link>
                <Link to="/solicitacoes" className="btn-outline">
                    Ver meus pedidos
                    <ArrowIcon className="h-4 w-4" />
                </Link>
            </div>
        </div>
    );
}

export default Dashboard;
