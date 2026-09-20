import DoacaoCard from "../../components/Doacoes/DoacaoCard";
import ContadorDoacoes from "../../components/Doacoes/ContadorDoacoes";
import { doacoes } from "../../data/content";


function Doacoes(){

    return(

        <div>

            <header>
                <h1>Doações Disponíveis</h1>
            </header>

            <main>
                <ContadorDoacoes quantidade={doacoes.length}/>

                {doacoes.map((doacao) =>(
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