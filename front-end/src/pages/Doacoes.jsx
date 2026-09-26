import { useState } from "react";

import DoacaoCard from "../components/Doacoes/DoacaoCard";
import FiltrosDoacoes from "../components/Doacoes/FiltrosDoacoes";
import ContadorDoacoes from "../components/Doacoes/ContadorDoacoes";
import { getDoacoes } from "../services/doacoesStorage";
import ModalDoacao from "../components/Doacoes/ModalDoacao";
import { Link } from "react-router-dom";

function converterData(data) {
    const [dia, mes, ano] = data.split("/");
    return new Date(ano, mes - 1, dia);
}

function Doacoes() {
    const [doacoes] = useState(getDoacoes());

    const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todas");
    const [statusSelecionado, setStatusSelecionado] = useState("Todos");
    const [ordenacaoSelecionada, setOrdenacaoSelecionada] = useState("validade");
    const [busca, setBusca] = useState("");
    const [doacaoSelecionada, setDoacaoSelecionada] = useState(null);

    const doacoesFiltradas = doacoes.filter((doacao) => {
        const categoriaCorresponde =
            categoriaSelecionada === "Todas" ||
            doacao.categoria === categoriaSelecionada;

        const statusCorresponde =
            statusSelecionado === "Todos" ||
            doacao.status === statusSelecionado;

        const buscaCorresponde =
            doacao.titulo.toLowerCase().includes(busca.toLowerCase());

        return categoriaCorresponde && statusCorresponde && buscaCorresponde;
    });

    const doacoesOrdenadas = [...doacoesFiltradas];

    if (ordenacaoSelecionada === "validade") {
        doacoesOrdenadas.sort((a, b) => {
            return converterData(a.validade) - converterData(b.validade);
        });
    }

    if (ordenacaoSelecionada === "nome") {
        doacoesOrdenadas.sort((a, b) => {
            return a.titulo.localeCompare(b.titulo);
        });
    }

    if (ordenacaoSelecionada === "recentes") {
        doacoesOrdenadas.sort((a, b) => {
            return converterData(b.dataCadastro) - converterData(a.dataCadastro);
        });
    }

    const abrirDetalhes = (doacao) => {
        console.log("CLICOU NO BOTÃO:", doacao);
        setDoacaoSelecionada(doacao);
    };

    return (
        <div className="min-h-screen py-10 px-6 md:px-10">
            <header></header>

            <main className="container-page">
                <Link
                    to="/"
                    className="mb-8 inline-flex items-center gap-2 rounded-xl border border-terracotta px-5 py-3 font-semibold text-terracotta transition hover:bg-terracotta/10"
                >
                    ← Voltar para Home
                </Link>

                <h1 className="mb-8 text-3xl font-bold md:text-4xl">
                    Doações Disponíveis
                </h1>

                <section className="doacoes-filtros">
                    <FiltrosDoacoes
                        busca={busca}
                        setBusca={setBusca}
                        categoriaSelecionada={categoriaSelecionada}
                        setCategoriaSelecionada={setCategoriaSelecionada}
                        statusSelecionado={statusSelecionado}
                        setStatusSelecionado={setStatusSelecionado}
                        ordenacaoSelecionada={ordenacaoSelecionada}
                        setOrdenacaoSelecionada={setOrdenacaoSelecionada}
                    />
                </section>

                <ContadorDoacoes
                    quantidade={doacoesFiltradas.length}
                />

                <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {doacoesOrdenadas.map((doacao) => (
                        <DoacaoCard
                            key={doacao.id}
                            doacao={doacao}
                            onVerDetalhes={abrirDetalhes}
                        />
                    ))}
                </section>

                {doacaoSelecionada && (
                    <ModalDoacao
                        doacao={doacaoSelecionada}
                        onFechar={() => setDoacaoSelecionada(null)}
                    />
                )}
            </main>
        </div>
    );
}

export default Doacoes;