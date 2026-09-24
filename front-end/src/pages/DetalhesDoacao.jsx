import { useParams } from "react-router-dom";
import { getDoacoes } from "../services/doacoesStorage";


function DetalhesDoacao(){

    const {id} = useParams();
    const doacoes = getDoacoes();

    const doacao = doacoes.find(
        (doacao) => doacao.id === Number(id)
    );
    if(!doacao){
        return(
            <div>
                <h1>Doação não encontrada</h1>
            </div>
        )
    }

    console.log(doacao);

    return(
        <div>
            <h1>{doacao.titulo}</h1>

            <p>Categoria: {doacao.categoria}</p>
            <p>Quantidade: {doacao.quantidade}</p>
            <p>Validade: {doacao.validade}</p>
            <p>Data de cadastro: {doacao.dataCadastro}</p>
            <p>Local: {doacao.local}</p>
            <p>Status: {doacao.status}</p>
        </div>
    )
}

export default DetalhesDoacao;