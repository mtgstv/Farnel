import { useParams } from "react-router-dom";
import { getDoacoes } from "../services/doacoesStorage";
import { Link } from "react-router-dom";



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
        <div className="min-h-screen px-6 py-10 md:px-10">

            <main className="container-page">

                <Link
                    to="/doacoes"
                    className="mb-8 inline-flex items-center gap-2 rounded-xl border border-terracotta px-5 py-3 font-semibold text-terracotta transition hover:bg-terracotta/10"
                >
                    ← Voltar para doações
                </Link>

                <div className="mb-10 grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center">

                    <img
                        src={doacao.imagem}
                        alt={doacao.titulo}
                        className="h-64 w-full rounded-2xl object-cover md:h-80"
                    />

                    <div>
                        <p className="mb-2 text-sm font-medium text-gray-500">
                            {doacao.categoria}
                        </p>

                        <h1 className="text-3xl font-bold md:text-4xl">
                            {doacao.titulo}
                        </h1>

                        <span
                            className={`mt-4 inline-block rounded-full px-3 py-1 text-sm font-medium ${
                                doacao.status === "Disponível"
                                    ? "bg-green-100 text-green-700"
                                    : doacao.status === "Solicitada"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : doacao.status === "Concluída"
                                            ? "bg-blue-100 text-blue-700"
                                            : "bg-red-100 text-red-700"
                            }`}
                        >
                            {doacao.status}
                        </span>

                    </div>

                </div>

                <section className="mb-8"> 
                    <h2 className="mb-3 text-xl font-semibold">
                        Sobre a doação
                    </h2>

                    <p className="text-gray-600">
                        {doacao.descricao}
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="mb-4 text-xl font-semibold">
                        Informações da doação
                    </h2>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>

                            <span className="text-sm text-gray-500">
                                Quantidade
                            </span>

                            <p className="font-medium">
                                {doacao.quantidade}
                            </p>

                        </div>

                        <div>
                            <span className="text-sm text-gray-500">
                                Validade
                            </span>

                            <p className="font-medium">
                                {doacao.validade}
                            </p>
                        </div>

                        <div>
                            <span className="text-sm text-gray-500">
                                Data de cadastro
                            </span>

                            <p className="font-medium">
                                {doacao.dataCadastro}
                            </p>
                        </div>
                    </div>
                </section>

                <section  className="mb-8">
                    <h2 className="mb-4 text-xl font-semibold">
                        Local e retirada
                    </h2>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <span className="text-sm text-gray-500">
                                Local
                            </span>

                            <p className="font-medium">
                                {doacao.local}
                            </p>
                        </div>

                        <div>
                            <span  className="text-sm text-gray-500">
                                Tipo de retirada
                            </span>

                            <p className="font-medium">
                                {doacao.tipoRetirada}
                            </p>
                        </div>
                    </div>

                    <div>
                        <span  className="text-sm text-gray-500">
                            Observações
                        </span>

                        <p className="font-medium">
                            {doacao.observacoes}
                        </p>
                    </div>
                </section>

                <section className="mb-8">
                    <h2  className="mb-4 text-xl font-semibold">
                        Informações do doador
                    </h2>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <span className="text-sm text-gray-500">
                                Doador
                            </span>

                            <p className="font-medium">
                                {doacao.doador}
                            </p>
                        </div>

                        <div>
                            <span className="text-sm text-gray-500">
                                Contato
                            </span>
                            <p className="font-medium">
                                {doacao.contato}
                            </p>
                        </div>
                    </div>
                </section>

                {doacao.status === "Disponível" && (
                    <button
                        type="button"
                        className="rounded-xl bg-green-600 px-6 py-3 font-medium text-white transition hover:bg-green-700"                    
                    >
                        Solicitar doação
                    </button>
                )}



            </main>

        </div>
    )
}

export default DetalhesDoacao;