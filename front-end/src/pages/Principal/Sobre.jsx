import { Link } from "react-router-dom";
import {
    contato,
    coverageRegions,
    donorSteps,
    partners,
    receiverSteps,
    stats,
} from "../../data/content";
import { ArrowIcon, PinIcon } from "../../components/Icons";

/*
 * Os ids das seções precisam ser iguais aos "secao" de footerLinks
 * (data/content.js), que levam direto para cada trecho desta página.
 */
const INDICE = [
    {
        grupo: "Institucional",
        itens: [
            { id: "sobre-nos", titulo: "Sobre nós" },
            { id: "resultados", titulo: "Nossos resultados" },
            { id: "transparencia", titulo: "Transparência fiscal" },
            { id: "contato", titulo: "Contato" },
        ],
    },
    {
        grupo: "Atuação",
        itens: [
            { id: "doadores", titulo: "Doadores" },
            { id: "cozinhas-parceiras", titulo: "Cozinhas parceiras" },
            { id: "logistica", titulo: "Logística de rotas" },
            { id: "cidades", titulo: "Cidades atendidas" },
            { id: "lei-do-doador", titulo: "Lei do Doador" },
        ],
    },
    {
        grupo: "Legal",
        itens: [
            { id: "privacidade", titulo: "Política de privacidade" },
            { id: "termos", titulo: "Termos de uso" },
        ],
    },
];

function Secao({ id, eyebrow, titulo, children }) {
    return (
        <section id={id} className="scroll-mt-28 border-b border-line pb-12 last:border-b-0 last:pb-0">
            <p className="eyebrow">{eyebrow}</p>
            <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">{titulo}</h2>
            <div className="mt-5 flex flex-col gap-4 text-sm leading-relaxed text-ink-soft sm:text-base">
                {children}
            </div>
        </section>
    );
}

function ListaPassos({ passos }) {
    return (
        <ol className="mt-2 grid gap-4 md:grid-cols-3">
            {passos.map((passo, indice) => (
                <li key={passo.title} className="rounded-2xl bg-white p-5 shadow-card">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-terracotta/10 text-sm font-bold text-terracotta-dark">
                        {indice + 1}
                    </span>
                    <p className="mt-3 font-semibold text-forest-dark">{passo.title}</p>
                    <p className="mt-1 text-sm text-ink-soft">{passo.text}</p>
                </li>
            ))}
        </ol>
    );
}

function Sobre() {
    return (
        <main className="bg-cream py-12 md:py-20">
            <div className="container-page">
                <header className="mx-auto max-w-2xl text-center">
                    <p className="eyebrow">Conheça o Farnel</p>
                    <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">
                        Comida boa não é para ir para o lixo
                    </h1>
                    <p className="mt-5 text-base leading-relaxed text-ink-soft">
                        Tudo sobre quem somos, como atuamos e as regras de uso da plataforma.
                    </p>
                </header>

                <div className="mt-14 grid gap-12 lg:grid-cols-[220px_1fr]">
                    <nav aria-label="Nesta página" className="lg:sticky lg:top-28 lg:self-start">
                        <div className="flex flex-col gap-6 rounded-2xl bg-white p-5 shadow-card sm:flex-row sm:justify-between lg:flex-col">
                            {INDICE.map(({ grupo, itens }) => (
                                <div key={grupo}>
                                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-forest-dark">
                                        {grupo}
                                    </p>
                                    <ul className="mt-3 space-y-2">
                                        {itens.map((item) => (
                                            <li key={item.id}>
                                                <Link
                                                    to={`#${item.id}`}
                                                    className="text-sm text-ink-soft transition-colors hover:text-forest-dark"
                                                >
                                                    {item.titulo}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </nav>

                    <div className="flex flex-col gap-12">
                        <Secao id="sobre-nos" eyebrow="Institucional" titulo="Sobre nós">
                            <p>
                                O Farnel nasceu de uma constatação simples: todos os dias, padarias,
                                feiras, mercados e restaurantes descartam alimentos em perfeitas
                                condições, enquanto muitas famílias não sabem se terão a próxima refeição.
                            </p>
                            <p>
                                A plataforma aproxima esses dois lados. Quem tem excedente cadastra a
                                doação em poucos minutos; instituições, cozinhas solidárias e pessoas que
                                precisam encontram o alimento perto de si e combinam a retirada.
                            </p>
                            <p>
                                O nome vem de <em>farnel</em>, a trouxa de comida que se leva para a
                                viagem: a ideia é que ninguém siga o caminho de barriga vazia.
                            </p>
                        </Secao>

                        <Secao id="resultados" eyebrow="Institucional" titulo="Nossos resultados">
                            <ul className="grid gap-4 sm:grid-cols-2">
                                {stats.map((item) => (
                                    <li key={item.label} className="rounded-2xl bg-white p-5 shadow-card">
                                        <p className="font-heading text-2xl font-semibold text-forest-dark">{item.value}</p>
                                        <p className="mt-1 font-semibold text-ink">{item.label}</p>
                                        <p className="text-sm text-ink-soft">{item.sub}</p>
                                    </li>
                                ))}
                            </ul>
                        </Secao>

                        <Secao id="transparencia" eyebrow="Institucional" titulo="Transparência fiscal">
                            <p>
                                Acreditamos que quem apoia tem o direito de saber como cada recurso é
                                usado. Nesta seção serão publicados os relatórios financeiros anuais,
                                as prestações de contas e as parcerias firmadas pela associação.
                            </p>
                            <p className="rounded-2xl bg-white p-5 text-sm shadow-card">
                                Os primeiros relatórios estão em preparação e serão disponibilizados
                                aqui assim que forem aprovados.
                            </p>
                        </Secao>

                        <Secao id="contato" eyebrow="Institucional" titulo="Contato">
                            <p>
                                Dúvidas, sugestões ou quer levar o Farnel para a sua cidade? Fale com a gente.
                            </p>
                            <ul className="grid gap-4 sm:grid-cols-2">
                                <li className="rounded-2xl bg-white p-5 shadow-card">
                                    <p className="rotulo-categoria">E-mail</p>
                                    <a href={`mailto:${contato.email}`} className="mt-1 block font-semibold text-forest-dark hover:underline">
                                        {contato.email}
                                    </a>
                                </li>
                                <li className="rounded-2xl bg-white p-5 shadow-card">
                                    <p className="rotulo-categoria">Telefone</p>
                                    <a href={`tel:${contato.telefone.replace(/\D/g, "")}`} className="mt-1 block font-semibold text-forest-dark hover:underline">
                                        {contato.telefone}
                                    </a>
                                </li>
                            </ul>
                            <p className="text-sm">Nossas redes sociais serão divulgadas em breve.</p>
                        </Secao>

                        <Secao id="doadores" eyebrow="Atuação" titulo="Doadores">
                            <p>
                                Qualquer pessoa ou estabelecimento pode doar: supermercados, feiras,
                                restaurantes, produtores rurais e também pessoas físicas. O importante é
                                que o alimento esteja dentro da validade e em boas condições de consumo.
                            </p>
                            <ListaPassos passos={donorSteps} />
                            <Link to="/doacoes/nova" className="btn-primary self-start">
                                Cadastrar uma doação
                                <ArrowIcon className="h-4 w-4" />
                            </Link>
                        </Secao>

                        <Secao id="cozinhas-parceiras" eyebrow="Atuação" titulo="Cozinhas parceiras">
                            <p>
                                Cozinhas solidárias, ONGs, abrigos e projetos comunitários recebem os
                                alimentos e os transformam em refeições para quem mais precisa.
                            </p>
                            <ListaPassos passos={receiverSteps} />
                            <p className="font-semibold text-ink">Algumas instituições da nossa rede:</p>
                            <ul className="grid gap-3 sm:grid-cols-2">
                                {partners.map((parceiro) => (
                                    <li key={parceiro.name} className="rounded-2xl bg-white px-5 py-4 shadow-card">
                                        <p className="font-semibold text-forest-dark">{parceiro.name}</p>
                                        <p className="text-xs text-ink-soft">
                                            {parceiro.category} · {parceiro.location}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </Secao>

                        <Secao id="logistica" eyebrow="Atuação" titulo="Logística de rotas">
                            <p>
                                Cada doação informa cidade, endereço, horários e forma de retirada. Com
                                isso, quem vai receber sabe exatamente onde e quando buscar, e o doador
                                pode indicar se prefere entregar ou combinar outro formato.
                            </p>
                            <p>
                                Alimentos refrigerados e congelados são sinalizados no cadastro, para que
                                a retirada seja feita com o transporte adequado e sem quebrar a cadeia de frio.
                            </p>
                        </Secao>

                        <Secao id="cidades" eyebrow="Atuação" titulo="Cidades atendidas">
                            <ul className="flex flex-col gap-5">
                                {coverageRegions.map((regiao) => (
                                    <li key={regiao.title} className="flex gap-3">
                                        <PinIcon className="mt-0.5 h-5 w-5 flex-none text-terracotta" />
                                        <div>
                                            <p className="font-semibold text-forest-dark">{regiao.title}</p>
                                            <p className="mt-1 text-sm text-ink-soft">{regiao.text}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <p>
                                Não encontrou a sua cidade? Entre em{" "}
                                <Link to="#contato" className="font-semibold text-forest-dark hover:underline">
                                    contato
                                </Link>{" "}
                                e ajude a levar o Farnel até ela.
                            </p>
                        </Secao>

                        <Secao id="lei-do-doador" eyebrow="Atuação" titulo="Lei do Doador">
                            <p>
                                A legislação brasileira incentiva a doação de alimentos excedentes que
                                estejam dentro do prazo de validade e próprios para o consumo. A{" "}
                                <a
                                    href="https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/l15224.htm"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="font-semibold text-forest-dark underline"
                                >
                                    Lei nº 15.224, de 30 de setembro de 2025
                                </a>{" "}
                                instituiu o Selo Doador de Alimentos, que reconhece quem pratica a doação.
                            </p>
                            <p>
                                Antes de doar, confira se o alimento está bem conservado, embalado e
                                identificado. Em caso de dúvida sobre as regras, consulte o texto da lei.
                            </p>
                        </Secao>

                        <Secao id="privacidade" eyebrow="Legal" titulo="Política de privacidade">
                            <p>
                                Coletamos apenas os dados necessários para o funcionamento da plataforma:
                                nome, e-mail e senha no cadastro, e as informações de contato e retirada
                                que você informa ao publicar uma doação.
                            </p>
                            <p>
                                Os dados de contato de uma doação ficam visíveis para os demais usuários,
                                para que a retirada possa ser combinada. Não vendemos nem compartilhamos
                                seus dados com terceiros.
                            </p>
                            <p>
                                Nesta versão da plataforma, as informações ficam armazenadas no próprio
                                navegador. Você pode apagá-las a qualquer momento limpando os dados do site.
                            </p>
                        </Secao>

                        <Secao id="termos" eyebrow="Legal" titulo="Termos de uso">
                            <p>Ao usar o Farnel, você concorda em:</p>
                            <ul className="list-disc space-y-2 pl-5">
                                <li>doar apenas alimentos dentro da validade e próprios para consumo;</li>
                                <li>informar dados verdadeiros sobre os alimentos, a quantidade e a retirada;</li>
                                <li>não usar a plataforma para vender alimentos ou obter qualquer vantagem;</li>
                                <li>tratar doadores, instituições e voluntários com respeito.</li>
                            </ul>
                            <p>
                                Contas que descumprirem estes termos podem ser suspensas. Os termos podem
                                ser atualizados, e as mudanças serão publicadas nesta página.
                            </p>
                        </Secao>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Sobre;
