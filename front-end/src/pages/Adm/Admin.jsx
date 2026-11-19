import { Link } from "react-router-dom";
import FaixaTopo from "../../components/Layout/FaixaTopo";
import FundoPagina from "../../components/Layout/FundoPagina";
import { Carregando, ErroAoCarregar } from "../../components/Comuns/EstadoRequisicao";
import { ArrowIcon } from "../../components/Comuns/Icons";
import { Destaque, GraficoBarras, TotaisEntregues } from "../../components/Painel/Indicadores";
import { rotulosDePedido } from "../../components/Painel/rotulosDePedido";
import { useCarregar } from "../../hooks/useCarregar";
import { buscarPainelGeral } from "../../services/adminService";

// Atalhos para as páginas de gerenciamento
const ATALHOS = [
    { para: "/admin/doacoes", titulo: "Gerenciar doações", texto: "Ver todas as doações e cancelar anúncios impróprios." },
    { para: "/admin/usuarios", titulo: "Gerenciar usuários", texto: "Ver as contas e escolher quem é administrador." },
    { para: "/admin/instituicoes", titulo: "Gerenciar instituições", texto: "Conferir e verificar as ONGs e cozinhas solidárias." },
];

// Painel administrativo: os números do site inteiro (GET /admin/painel, só para administradores)
function Admin() {
    const { dados: painel, erro, recarregar } = useCarregar(buscarPainelGeral);

    return (
        <div className="min-h-screen">
            <FaixaTopo
                eyebrow="Administração"
                titulo="Painel administrativo"
                descricao="Os números do Farnel inteiro, contados direto no banco."
            />

            <FundoPagina>
                <main className="container-largo py-10 md:py-14">
                    {erro ? (
                        <ErroAoCarregar erro={erro} onTentarNovamente={recarregar} titulo="Não foi possível carregar o painel" />
                    ) : !painel ? (
                        <Carregando texto="Carregando os números do site..." />
                    ) : (
                        <div className="flex flex-col gap-8">
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
                                <Destaque
                                    valor={painel.contas}
                                    rotulo="Contas"
                                    detalhe={`${painel.administradores} ${painel.administradores === 1 ? "administradora" : "administradoras"}`}
                                />
                                <Destaque valor={painel.instituicoes} rotulo="Instituições" detalhe="ONGs e cozinhas solidárias" />
                                <Destaque valor={painel.doadores} rotulo="Doadores" detalhe="Contas com alguma doação" />
                                <Destaque valor={painel.totalDoacoes} rotulo="Doações" detalhe="Cadastradas no site" />
                                <Destaque valor={painel.totalPedidos} rotulo="Pedidos" detalhe="Feitos no site" />
                                <Destaque valor={painel.pessoasAtendidas} rotulo="Pessoas atendidas" detalhe="Já receberam doações" />
                            </div>

                            <div className="grid gap-6 lg:grid-cols-2">
                                <GraficoBarras
                                    titulo="Doações por situação"
                                    descricao="Vencida é a doação ainda ativa cuja validade já passou."
                                    itens={painel.doacoesPorStatus}
                                    vazio="Ainda não há doações."
                                />
                                <GraficoBarras
                                    titulo="Doações por categoria"
                                    itens={painel.doacoesPorCategoria}
                                    vazio="Ainda não há doações."
                                />
                                <GraficoBarras
                                    titulo="Pedidos por status"
                                    itens={rotulosDePedido(painel.pedidosPorStatus)}
                                    vazio="Ainda não há pedidos."
                                />
                                <TotaisEntregues
                                    titulo="Quanto já foi entregue"
                                    descricao="Soma das doações entregues no site, por unidade."
                                    entregue={painel.entregue}
                                    vazio="Nenhuma doação foi entregue ainda."
                                />
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                {ATALHOS.map(({ para, titulo, texto }) => (
                                    <Link key={para} to={para} className="cartao group flex flex-col gap-2 p-6 transition hover:-translate-y-0.5">
                                        <span className="flex items-center justify-between text-lg font-semibold text-forest-dark">
                                            {titulo}
                                            <ArrowIcon className="h-4 w-4 transition group-hover:translate-x-1" />
                                        </span>
                                        <span className="text-sm text-ink-soft">{texto}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </main>
            </FundoPagina>
        </div>
    );
}

export default Admin;
