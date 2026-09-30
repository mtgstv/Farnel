import { CheckIcon } from "../Icons";

/*
 * Grupo de opções únicas (radio) mostradas como cartões com ícone e explicação.
 * - opcoes: [{ valor, descricao, icone }]
 * O primeiro radio recebe id={nome}, para o formulário conseguir focar o grupo quando há erro.
 */
function OpcoesCartao({ nome, legenda, opcoes, valor, onChange, erro }) {
    return (
        <fieldset className="flex flex-col gap-2">
            <legend className="rotulo mb-2">{legenda}</legend>

            <div className="grid gap-3 sm:grid-cols-3">
                {opcoes.map(({ valor: opcao, descricao, icone: Icone }, i) => {
                    const marcado = valor === opcao;

                    return (
                        <label
                            key={opcao}
                            className={`relative flex cursor-pointer flex-col gap-2 rounded-2xl border-2 p-4 transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-forest/30 ${marcado
                                ? "border-forest bg-forest/5"
                                : `bg-cream hover:border-forest/40 hover:bg-white ${erro ? "border-terracotta-dark/40" : "border-transparent"}`
                                }`}
                        >
                            <input
                                type="radio"
                                id={i === 0 ? nome : undefined}
                                name={nome}
                                value={opcao}
                                checked={marcado}
                                onChange={() => onChange(opcao)}
                                aria-invalid={Boolean(erro)}
                                aria-describedby={erro ? `${nome}-erro` : undefined}
                                className="sr-only"
                            />

                            <span
                                aria-hidden="true"
                                className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${marcado ? "bg-forest text-white" : "bg-white text-forest-dark"}`}
                            >
                                <Icone className="h-5 w-5" />
                            </span>
                            <span className="text-sm font-semibold text-ink">{opcao}</span>
                            <span className="text-xs leading-relaxed text-ink-soft">{descricao}</span>

                            {marcado && (
                                <CheckIcon aria-hidden="true" className="absolute right-3.5 top-3.5 h-5 w-5 text-forest" />
                            )}
                        </label>
                    );
                })}
            </div>

            {erro && (
                <p id={`${nome}-erro`} className="text-sm text-terracotta-dark">
                    {erro}
                </p>
            )}
        </fieldset>
    );
}

export default OpcoesCartao;
