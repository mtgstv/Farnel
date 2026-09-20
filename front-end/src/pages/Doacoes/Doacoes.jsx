import { useState } from "react";
import DoacaoCard from "../../components/Doacoes/DoacaoCard";
import FiltrosDoacoes from "../../components/Doacoes/FiltrosDoacoes";
import ContadorDoacoes from "../../components/Doacoes/ContadorDoacoes";
import { doacoes } from "../../data/content";


function Doacoes(){

    const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todas");
    const [statusSelecionado, setStatusSelecionado] = useState("Todos");

    const doacoesFiltradas = doacoes.filter((doacao)=>{
        const categoriaCorresponde = 
            categoriaSelecionada === "Todas" ||
            doacao.categoria === categoriaSelecionada;

        const statusCorresponde = 
            statusSelecionado === "Todos" ||
            doacao.status === statusSelecionado;

        return categoriaCorresponde && statusCorresponde;
    });

    return(

        <div>

            <header>
                <h1>Doações Disponíveis</h1>
            </header>

            <main>
                <FiltrosDoacoes
                    categoriaSelecionada={categoriaSelecionada}
                    setCategoriaSelecionada={setCategoriaSelecionada}
                    statusSelecionado={statusSelecionado}
                    setStatusSelecionado={setStatusSelecionado}
                />

                <ContadorDoacoes quantidade={doacoesFiltradas.length}/>

                {doacoesFiltradas.map((doacao) =>(
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
            </main>

        </div>

    );
}

export default Doacoes;