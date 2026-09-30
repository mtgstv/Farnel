import SeloStatus from "../Doacoes/SeloStatus";
import { CalendarIcon, CameraOffIcon, PinIcon } from "../Icons";
import { hojeISO, paraDataBR } from "../../services/formatacao";
import { diasAteVencer, textoVencimento } from "../../services/ordenacaoDoacoes";

// Texto que ainda não foi preenchido aparece apagado, como um "esboço" do cartão.
function Valor({ children, vazio }) {
    return <span className={children ? "text-ink" : "text-ink-soft/60"}>{children || vazio}</span>;
}

// Prévia ao vivo do cartão da doação, no mesmo formato da lista de doações.
function PreviaDoacao({ form }) {
    const validadeOk = form.validade && form.validade >= hojeISO();
    const cidade = form.cidade.trim();

    return (
        <article className="cartao overflow-hidden">
            <div className="relative">
                {form.imagem ? (
                    <img src={form.imagem} alt="" className="aspect-[16/10] w-full object-cover" />
                ) : (
                    <div className="flex aspect-[16/10] w-full flex-col items-center justify-center gap-2 bg-cream-dark text-ink-soft/70">
                        <CameraOffIcon className="h-10 w-10" />
                        <span className="text-xs font-medium">Sua foto aparece aqui</span>
                    </div>
                )}
                <SeloStatus status="Disponível" sobreFoto className="absolute left-3 top-3" />
            </div>

            <div className="p-5">
                <p className="rotulo-categoria">{form.categoria || "Categoria"}</p>
                <h3 className={`mt-1 break-words text-lg font-semibold ${form.titulo.trim() ? "" : "text-ink-soft/60"}`}>
                    {form.titulo.trim() || "Nome do alimento"}
                </h3>

                <dl className="mt-3 flex flex-col gap-1.5 text-sm">
                    <div className="flex gap-1.5">
                        <dt className="font-semibold text-ink">Quantidade:</dt>
                        <dd><Valor vazio="—">{Number(form.quantidade) > 0 && `${Number(form.quantidade)} ${form.unidade}`}</Valor></dd>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <dt><CalendarIcon className="h-4 w-4 text-forest" /><span className="sr-only">Validade</span></dt>
                        <dd>
                            <Valor vazio="Validade">
                                {validadeOk && `${paraDataBR(form.validade)} · ${textoVencimento(diasAteVencer(paraDataBR(form.validade)))}`}
                            </Valor>
                        </dd>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <dt><PinIcon className="h-4 w-4 text-forest" /><span className="sr-only">Local</span></dt>
                        <dd><Valor vazio="Cidade/UF">{cidade && `${cidade}${form.uf ? `/${form.uf}` : ""}`}</Valor></dd>
                    </div>
                </dl>

                {form.tipoRetirada && (
                    <p className="mt-3 inline-flex rounded-full bg-cream px-3 py-1 text-xs font-semibold text-forest-dark">
                        {form.tipoRetirada}
                    </p>
                )}
            </div>
        </article>
    );
}

export default PreviaDoacao;
