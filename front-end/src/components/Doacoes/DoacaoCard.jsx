function DoacaoCard ({categoria, titulo, quantidade, validade, local, status}){
    return(
        <div>

            <p>{categoria}</p>
        
            <h2>{titulo}</h2>

            <p>Quantidade: {quantidade}</p>

            <p>Validade: {validade}</p>

            <p>Local: {local}</p>

            <p>Status: {status}</p>

            <button>Ver detalhes</button>
        </div>
    )
}

export default DoacaoCard;