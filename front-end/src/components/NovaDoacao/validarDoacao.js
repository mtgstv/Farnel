import { hojeISO, telefoneValido } from "../../services/formatacao";

// Retorna um objeto { campo: "mensagem" } com os erros, na ordem em que aparecem na tela.
export function validarDoacao(form) {
    const erros = {};

    if (form.titulo.trim().length < 3) erros.titulo = "Dê um nome ao alimento (mínimo de 3 letras).";
    if (!form.categoria) erros.categoria = "Escolha uma categoria.";
    if (form.descricao.trim().length < 10) erros.descricao = "Descreva o alimento (mínimo de 10 caracteres).";
    if (!(Number(form.quantidade) > 0)) erros.quantidade = "Informe uma quantidade maior que zero.";
    if (!form.unidade) erros.unidade = "Escolha a unidade.";

    if (!form.validade) {
        erros.validade = "Informe a data de validade.";
    } else if (form.validade < hojeISO()) {
        erros.validade = "Não é possível doar alimentos vencidos.";
    }

    if (!form.conservacao) erros.conservacao = "Informe como o alimento deve ser conservado.";
    if (!form.tipoRetirada) erros.tipoRetirada = "Escolha como será a retirada.";
    if (!form.cidade.trim()) erros.cidade = "Informe a cidade.";
    if (!form.uf) erros.uf = "Escolha o estado.";

    if (enderecoObrigatorio(form) && !form.endereco.trim()) {
        erros.endereco = "Informe o endereço de retirada.";
    }

    if (!form.doador.trim()) erros.doador = "Informe o nome do doador ou do estabelecimento.";
    if (!telefoneValido(form.contato)) erros.contato = "Informe um telefone com DDD.";
    if (!form.declaracao) erros.declaracao = "Confirme que o alimento está próprio para consumo.";

    return erros;
}

export function enderecoObrigatorio(form) {
    return form.tipoRetirada === "Retirada no local";
}

// Etapas do formulário e os campos obrigatórios de cada uma (usados no progresso).
export const ETAPAS = [
    { id: "etapa-alimento", titulo: "O alimento", campos: ["titulo", "categoria", "descricao"] },
    { id: "etapa-quantidade", titulo: "Quantidade e validade", campos: ["quantidade", "unidade", "validade", "conservacao"] },
    { id: "etapa-retirada", titulo: "Retirada", campos: ["tipoRetirada", "cidade", "uf", "endereco"] },
    { id: "etapa-contato", titulo: "Contato", campos: ["doador", "contato"] },
    { id: "etapa-publicar", titulo: "Publicar", campos: ["declaracao"] },
];

/*
 * Resumo do preenchimento a partir dos erros atuais (sem mostrá-los na tela):
 * quais etapas estão completas e quantos campos obrigatórios já estão ok.
 */
export function progressoDoacao(form, errosAtuais) {
    const obrigatorios = ETAPAS.flatMap((etapa) => etapa.campos)
        .filter((campo) => campo !== "endereco" || enderecoObrigatorio(form));

    return {
        etapas: ETAPAS.map((etapa) => ({
            ...etapa,
            completa: etapa.campos.every((campo) => !errosAtuais[campo]),
        })),
        preenchidos: obrigatorios.filter((campo) => !errosAtuais[campo]).length,
        total: obrigatorios.length,
    };
}
