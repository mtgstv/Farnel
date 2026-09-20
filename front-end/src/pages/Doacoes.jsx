import "./Doacoes.css";
import { useState } from "react";
import DoacaoCard from "../components/Doacoes/DoacaoCard";
import FiltrosDoacoes from "../components/Doacoes/FiltrosDoacoes";
import ContadorDoacoes from "../components/Doacoes/ContadorDoacoes";
import { doacoes } from "../data/content";

function converterData(data) {
    const [dia, mes, ano] = data.split("/");
    return new Date(ano, mes - 1, dia);
}

function Doacoes(){

    const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todas");
    const [statusSelecionado, setStatusSelecionado] = useState("Todos");
    const [ordenacaoSelecionada, setOrdenacaoSelecionada] = useState("validade");
    const [busca, setBusca] = useState("");

    const doacoesFiltradas = doacoes.filter((doacao)=>{
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

    return(

        <div className="doacoes-page">

            <header>
                
            </header>

            <main className="doacoes-container">

                <h1 className="doacoes-titulo">
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

                <ContadorDoacoes quantidade={doacoesFiltradas.length}/>

                <section>
                    {doacoesOrdenadas.map((doacao) =>(
                        <DoacaoCard
                            key={doacao.id}
                            categoria={doacao.categoria}
                            titulo={doacao.titulo}
                            quantidade={doacao.quantidade}
                            validade={doacao.validade}
                            local={doacao.local}
                            status={doacao.status}
                        />
                    ))}
                </section>

            </main>

        </div>

    );
}

export default Doacoes;