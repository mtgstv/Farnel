// Atributos de acessibilidade para ligar um campo do formulário à sua mensagem de erro
// (a mensagem é exibida pelo <Campo> com o id `${nome}-erro`).
export function atributosErro(erros, nome) {
    return {
        "aria-invalid": Boolean(erros[nome]),
        "aria-describedby": erros[nome] ? `${nome}-erro` : undefined,
    };
}
