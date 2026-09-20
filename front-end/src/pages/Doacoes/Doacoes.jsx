import DoacaoCard from "../../components/Doacoes/DoacaoCard";
import { doacoes } from "../../data/content";

function Doacoes(){

    return(

        <div>
            
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
            

        </div>

    );
}

export default Doacoes;