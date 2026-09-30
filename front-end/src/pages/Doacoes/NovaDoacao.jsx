import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FaixaTopo from "../../components/FaixaTopo";
import FundoPagina from "../../components/FundoPagina";
import { Campo } from "../../components/Formulario";
import { atributosErro } from "../../components/atributosErro";
import EnvioFoto from "../../components/NovaDoacao/EnvioFoto";
import OpcoesCartao from "../../components/NovaDoacao/OpcoesCartao";
import PreviaDoacao from "../../components/NovaDoacao/PreviaDoacao";
import SecaoFormulario from "../../components/NovaDoacao/SecaoFormulario";
import { EtapasFaixa, ProgressoCadastro } from "../../components/NovaDoacao/ProgressoCadastro";
import { enderecoObrigatorio, progressoDoacao, validarDoacao } from "../../components/NovaDoacao/validarDoacao";
import {
    AlertIcon,
    ArrowIcon,
    BasketIcon,
    CalendarIcon,
    CheckIcon,
    HandshakeIcon,
    PinIcon,
    ShieldIcon,
    SnowflakeIcon,
    SunIcon,
    ThermometerIcon,
    TruckIcon,
    UserIcon,
} from "../../components/Icons";
import { getUsuarioLogado } from "../../services/authStorage";
import { getUsuarioPorId } from "../../services/usuariosStorage";
import { adicionarDoacao } from "../../services/doacoesStorage";
import { comprimirImagem } from "../../services/imagem";
import { formatarTelefone, hojeISO, paraDataBR } from "../../services/formatacao";
import { diasAteVencer, textoVencimento } from "../../services/ordenacaoDoacoes";
import { ALERGENICOS, CATEGORIAS, ESTADOS, UNIDADES } from "../../data/opcoesDoacao";
import imagemPadrao from "../../assets/ImgDescricao/imgtest.jpg";

const TAMANHO_MAXIMO_IMAGEM = 10 * 1024 * 1024; // 10 MB, antes da compressão
const MAX_DESCRICAO = 500;
const MAX_OBSERVACOES = 300;

// Mesmos valores de CONSERVACAO e TIPOS_RETIRADA (opcoesDoacao.js), com ícone e explicação.
const OPCOES_CONSERVACAO = [
    { valor: "Temperatura ambiente", icone: SunIcon, descricao: "Pode ficar fora da geladeira." },
    { valor: "Refrigerado", icone: ThermometerIcon, descricao: "Precisa ficar na geladeira." },
    { valor: "Congelado", icone: SnowflakeIcon, descricao: "Precisa ficar no freezer." },
];

const OPCOES_RETIRADA = [
    { valor: "Retirada no local", icone: PinIcon, descricao: "Quem receber busca no endereço informado." },
    { valor: "Entrega pelo doador", icone: TruckIcon, descricao: "Você leva o alimento até quem pediu." },
    { valor: "A combinar", icone: HandshakeIcon, descricao: "Vocês decidem juntos depois do pedido." },
];

const DICAS = [
    "Use uma foto real e bem iluminada do alimento.",
    "Informe a validade exata que está na embalagem.",
    "Conte na descrição como o alimento está embalado.",
];

// Leva o foco (e a tela) até o campo, deixando-o no meio da tela, longe do header fixo.
function focarCampo(nome) {
    const campo = document.getElementById(nome);
    if (!campo) return;
    campo.focus({ preventScroll: true });
    campo.scrollIntoView({ behavior: "smooth", block: "center" });
}

function formularioInicial(usuario) {
    // Os dados salvos no perfil já preenchem o doador, o contato e a retirada.
    const perfil = usuario ? getUsuarioPorId(usuario.id) : null;

    return {
        titulo: "",
        categoria: "",
        descricao: "",
        quantidade: "",
        unidade: "kg",
        validade: "",
        conservacao: "",
        alergenicos: [],
        imagem: null,
        tipoRetirada: "",
        cidade: perfil?.cidade ?? "",
        uf: perfil?.uf ?? "",
        endereco: perfil?.endereco ?? "",
        horario: perfil?.horario ?? "",
        observacoes: "",
        doador: perfil?.organizacao || usuario?.nome || "",
        contato: perfil?.telefone ?? "",
        declaracao: false,
    };
}

// Texto de apoio da validade: mostra em quantos dias o alimento vence.
function dicaValidade(validade) {
    if (!validade || validade < hojeISO()) return "A doação fica disponível até essa data.";
    const dias = diasAteVencer(paraDataBR(validade));
    return dias <= 3
        ? `${textoVencimento(dias)}: prazo curto, a doação vai aparecer em destaque.`
        : `${textoVencimento(dias)}.`;
}

function NovaDoacao() {
    const usuario = getUsuarioLogado();
    const navigate = useNavigate();

    const [form, setForm] = useState(() => formularioInicial(usuario));
    const [erros, setErros] = useState({});
    const [tentouEnviar, setTentouEnviar] = useState(false);
    const [erroGeral, setErroGeral] = useState("");
    const [carregandoImagem, setCarregandoImagem] = useState(false);

    // Situação atual de cada campo, usada no progresso (os erros só aparecem ao sair do campo ou ao enviar).
    const errosAtuais = validarDoacao(form);
    const { etapas, preenchidos, total } = progressoDoacao(form, errosAtuais);
    const etapaCompleta = (id) => etapas.find((etapa) => etapa.id === id).completa;
    const listaErros = Object.entries(erros);

    function setCampo(nome, valor) {
        setForm((atual) => ({ ...atual, [nome]: valor }));

        // Some com o erro do campo assim que a pessoa começa a corrigi-lo.
        setErros((atuais) => {
            if (!atuais[nome]) return atuais;
            const novos = { ...atuais };
            delete novos[nome];
            return novos;
        });
    }

    function handleChange(event) {
        setCampo(event.target.name, event.target.value);
    }

    // Ao sair de um campo já preenchido, avisa na hora se algo está errado (ex.: telefone incompleto).
    function handleBlur(event) {
        const { name, value, type } = event.target;
        if (!name || type === "checkbox" || type === "file" || !String(value).trim()) return;
        if (errosAtuais[name]) setErros((atuais) => ({ ...atuais, [name]: errosAtuais[name] }));
    }

    function mostrarErro(nome, mensagem) {
        setErros((atuais) => ({ ...atuais, [nome]: mensagem }));
    }

    function alternarAlergenico(alergenico) {
        setCampo(
            "alergenicos",
            form.alergenicos.includes(alergenico)
                ? form.alergenicos.filter((item) => item !== alergenico)
                : [...form.alergenicos, alergenico]
        );
    }

    async function handleImagem(arquivo) {
        if (!arquivo.type.startsWith("image/")) {
            mostrarErro("imagem", "Escolha um arquivo de imagem (JPG, PNG...).");
            return;
        }

        if (arquivo.size > TAMANHO_MAXIMO_IMAGEM) {
            mostrarErro("imagem", "A imagem deve ter no máximo 10 MB.");
            return;
        }

        setCarregandoImagem(true);
        try {
            setCampo("imagem", await comprimirImagem(arquivo));
        } catch {
            mostrarErro("imagem", "Não foi possível carregar essa imagem.");
        } finally {
            setCarregandoImagem(false);
        }
    }

    function handleSubmit(event) {
        event.preventDefault();
        setErroGeral("");
        setTentouEnviar(true);
        setErros(errosAtuais);

        const primeiroErro = Object.keys(errosAtuais)[0];
        if (primeiroErro) {
            focarCampo(primeiroErro);
            return;
        }

        const novaDoacao = {
            id: Date.now(),
            titulo: form.titulo.trim(),
            categoria: form.categoria,
            imagem: form.imagem ?? imagemPadrao,
            descricao: form.descricao.trim(),
            quantidade: `${Number(form.quantidade)} ${form.unidade}`,
            validade: paraDataBR(form.validade),
            dataCadastro: paraDataBR(hojeISO()),
            conservacao: form.conservacao,
            alergenicos: form.alergenicos,
            local: `${form.cidade.trim()}/${form.uf}`,
            endereco: form.endereco.trim(),
            tipoRetirada: form.tipoRetirada,
            horario: form.horario.trim(),
            observacoes: form.observacoes.trim(),
            doador: form.doador.trim(),
            contato: form.contato,
            status: "Disponível",
            usuarioId: usuario.id,
        };

        try {
            adicionarDoacao(novaDoacao);
        } catch {
            // O localStorage lança erro quando fica cheio (geralmente por causa das fotos).
            setErroGeral("Não foi possível salvar a doação. Tente usar uma foto menor ou remover a foto.");
            return;
        }

        // A página de detalhes mostra a confirmação de que a doação foi publicada.
        navigate(`/detalhes/${novaDoacao.id}`, { state: { publicada: true } });
    }

    return (
        <main className="bg-cream">
            <FaixaTopo
                eyebrow="Doe alimentos"
                titulo="Cadastrar nova doação"
                descricao="Leva poucos minutos. Assim que for publicada, pessoas e instituições da sua região já podem solicitar."
                voltarPara="/doacoes"
                textoVoltar="Voltar para doações"
            >
                <EtapasFaixa etapas={etapas} />
            </FaixaTopo>

            <FundoPagina>
                <div className="container-largo grid gap-8 py-10 md:py-12 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start xl:gap-10">
                    <form onSubmit={handleSubmit} onBlur={handleBlur} noValidate className="flex min-w-0 flex-col gap-6">
                        <p className="text-sm text-ink-soft">
                            Todos os campos são obrigatórios, exceto os marcados como <span className="font-semibold text-ink">(opcional)</span>.
                        </p>

                        {tentouEnviar && listaErros.length > 0 && (
                            <div role="alert" className="cartao border-l-4 border-terracotta-dark p-5 sm:p-6">
                                <p className="flex items-center gap-2 font-semibold text-terracotta-dark">
                                    <AlertIcon className="h-5 w-5 flex-none" />
                                    {listaErros.length === 1
                                        ? "Falta 1 informação para publicar"
                                        : `Faltam ${listaErros.length} informações para publicar`}
                                </p>
                                <ul className="mt-3 flex flex-col gap-1.5 pl-7 text-sm">
                                    {listaErros.map(([campo, mensagem]) => (
                                        <li key={campo}>
                                            <button
                                                type="button"
                                                onClick={() => focarCampo(campo)}
                                                className="text-left text-ink underline decoration-ink-soft/40 underline-offset-2 hover:text-terracotta-dark hover:decoration-terracotta-dark"
                                            >
                                                {mensagem}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <SecaoFormulario
                            id="etapa-alimento"
                            numero={1}
                            total={etapas.length}
                            icone={BasketIcon}
                            titulo="O alimento"
                            descricao="O que você vai doar? Um bom nome e uma foto ajudam a doação a ser encontrada."
                            completa={etapaCompleta("etapa-alimento")}
                        >
                            <div className="grid gap-5 sm:grid-cols-[3fr_2fr]">
                                <Campo id="titulo" rotulo="Nome do alimento" erro={erros.titulo}>
                                    <input
                                        type="text"
                                        id="titulo"
                                        name="titulo"
                                        value={form.titulo}
                                        onChange={handleChange}
                                        placeholder="Ex.: Pães artesanais"
                                        maxLength={80}
                                        className="campo"
                                        {...atributosErro(erros, "titulo")}
                                    />
                                </Campo>

                                <Campo id="categoria" rotulo="Categoria" erro={erros.categoria}>
                                    <select
                                        id="categoria"
                                        name="categoria"
                                        value={form.categoria}
                                        onChange={handleChange}
                                        className="campo"
                                        {...atributosErro(erros, "categoria")}
                                    >
                                        <option value="">Selecione...</option>
                                        {CATEGORIAS.map((categoria) => (
                                            <option key={categoria} value={categoria}>{categoria}</option>
                                        ))}
                                    </select>
                                </Campo>
                            </div>

                            <Campo
                                id="descricao"
                                rotulo="Descrição"
                                erro={erros.descricao}
                                contador={`${form.descricao.length}/${MAX_DESCRICAO}`}
                                dica="Conte o estado do alimento, a embalagem e o que mais for útil para quem vai receber."
                            >
                                <textarea
                                    id="descricao"
                                    name="descricao"
                                    value={form.descricao}
                                    onChange={handleChange}
                                    rows={4}
                                    maxLength={MAX_DESCRICAO}
                                    placeholder="Ex.: 20 pães de fermentação natural, feitos hoje, embalados em sacos de papel."
                                    className="campo resize-y"
                                    {...atributosErro(erros, "descricao")}
                                />
                            </Campo>

                            <EnvioFoto
                                imagem={form.imagem}
                                carregando={carregandoImagem}
                                erro={erros.imagem}
                                onArquivo={handleImagem}
                                onRemover={() => setCampo("imagem", null)}
                            />
                        </SecaoFormulario>

                        <SecaoFormulario
                            id="etapa-quantidade"
                            numero={2}
                            total={etapas.length}
                            icone={CalendarIcon}
                            titulo="Quantidade e validade"
                            descricao="Essas informações ajudam quem recebe a saber se a doação atende à necessidade."
                            completa={etapaCompleta("etapa-quantidade")}
                        >
                            <div className="grid gap-5 sm:grid-cols-2">
                                <Campo id="quantidade" rotulo="Quantidade" erro={erros.quantidade ?? erros.unidade}>
                                    <div className="flex">
                                        <input
                                            type="number"
                                            id="quantidade"
                                            name="quantidade"
                                            value={form.quantidade}
                                            onChange={handleChange}
                                            min="0"
                                            step="any"
                                            inputMode="decimal"
                                            placeholder="0"
                                            className="campo min-w-0 rounded-r-none"
                                            {...atributosErro(erros, "quantidade")}
                                        />
                                        <select
                                            id="unidade"
                                            name="unidade"
                                            aria-label="Unidade"
                                            value={form.unidade}
                                            onChange={handleChange}
                                            aria-invalid={Boolean(erros.unidade)}
                                            aria-describedby={erros.unidade ? "quantidade-erro" : undefined}
                                            className="campo w-auto flex-none rounded-l-none border-l-0 bg-cream-dark/60 font-semibold"
                                        >
                                            {UNIDADES.map((unidade) => (
                                                <option key={unidade} value={unidade}>{unidade}</option>
                                            ))}
                                        </select>
                                    </div>
                                </Campo>

                                <Campo id="validade" rotulo="Data de validade" erro={erros.validade} dica={dicaValidade(form.validade)}>
                                    <input
                                        type="date"
                                        id="validade"
                                        name="validade"
                                        value={form.validade}
                                        onChange={handleChange}
                                        min={hojeISO()}
                                        className="campo"
                                        {...atributosErro(erros, "validade")}
                                    />
                                </Campo>
                            </div>

                            <OpcoesCartao
                                nome="conservacao"
                                legenda="Como o alimento deve ser conservado?"
                                opcoes={OPCOES_CONSERVACAO}
                                valor={form.conservacao}
                                onChange={(valor) => setCampo("conservacao", valor)}
                                erro={erros.conservacao}
                            />

                            <fieldset className="flex flex-col gap-2">
                                <legend className="rotulo mb-1">
                                    Contém alergênicos? <span className="font-normal text-ink-soft">(opcional)</span>
                                </legend>
                                <p className="mb-1 text-xs text-ink-soft">Marque todos que se aplicam. Se não houver, deixe em branco.</p>

                                <div className="flex flex-wrap gap-2">
                                    {ALERGENICOS.map((alergenico) => {
                                        const marcado = form.alergenicos.includes(alergenico);

                                        return (
                                            <label
                                                key={alergenico}
                                                className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-forest/30 ${marcado
                                                    ? "border-forest bg-forest text-white"
                                                    : "border-line bg-cream text-ink-soft hover:border-forest/40 hover:text-ink"
                                                    }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={marcado}
                                                    onChange={() => alternarAlergenico(alergenico)}
                                                    className="sr-only"
                                                />
                                                {marcado && <CheckIcon aria-hidden="true" className="-ml-1 h-4 w-4" />}
                                                {alergenico}
                                            </label>
                                        );
                                    })}
                                </div>
                            </fieldset>
                        </SecaoFormulario>

                        <SecaoFormulario
                            id="etapa-retirada"
                            numero={3}
                            total={etapas.length}
                            icone={PinIcon}
                            titulo="Retirada"
                            descricao="Onde está o alimento e como ele vai chegar a quem precisa."
                            completa={etapaCompleta("etapa-retirada")}
                        >
                            <OpcoesCartao
                                nome="tipoRetirada"
                                legenda="Como será a retirada?"
                                opcoes={OPCOES_RETIRADA}
                                valor={form.tipoRetirada}
                                onChange={(valor) => setCampo("tipoRetirada", valor)}
                                erro={erros.tipoRetirada}
                            />

                            <div className="grid gap-5 sm:grid-cols-[3fr_1fr]">
                                <Campo id="cidade" rotulo="Cidade" erro={erros.cidade}>
                                    <input
                                        type="text"
                                        id="cidade"
                                        name="cidade"
                                        value={form.cidade}
                                        onChange={handleChange}
                                        autoComplete="address-level2"
                                        placeholder="Ex.: Campinas"
                                        className="campo"
                                        {...atributosErro(erros, "cidade")}
                                    />
                                </Campo>

                                <Campo id="uf" rotulo="Estado" erro={erros.uf}>
                                    <select
                                        id="uf"
                                        name="uf"
                                        value={form.uf}
                                        onChange={handleChange}
                                        autoComplete="address-level1"
                                        className="campo"
                                        {...atributosErro(erros, "uf")}
                                    >
                                        <option value="">UF</option>
                                        {ESTADOS.map((uf) => (
                                            <option key={uf} value={uf}>{uf}</option>
                                        ))}
                                    </select>
                                </Campo>
                            </div>

                            <Campo
                                id="endereco"
                                rotulo="Endereço de retirada"
                                opcional={!enderecoObrigatorio(form)}
                                erro={erros.endereco}
                                dica={enderecoObrigatorio(form) ? "Obrigatório para retirada no local." : undefined}
                            >
                                <input
                                    type="text"
                                    id="endereco"
                                    name="endereco"
                                    value={form.endereco}
                                    onChange={handleChange}
                                    placeholder="Rua, número, bairro"
                                    autoComplete="street-address"
                                    className="campo"
                                    {...atributosErro(erros, "endereco")}
                                />
                            </Campo>

                            <Campo id="horario" rotulo="Dias e horários disponíveis" opcional>
                                <input
                                    type="text"
                                    id="horario"
                                    name="horario"
                                    value={form.horario}
                                    onChange={handleChange}
                                    placeholder="Ex.: Seg. a sex., das 8h às 17h"
                                    className="campo"
                                />
                            </Campo>

                            <Campo
                                id="observacoes"
                                rotulo="Observações"
                                opcional
                                contador={`${form.observacoes.length}/${MAX_OBSERVACOES}`}
                            >
                                <textarea
                                    id="observacoes"
                                    name="observacoes"
                                    value={form.observacoes}
                                    onChange={handleChange}
                                    rows={3}
                                    maxLength={MAX_OBSERVACOES}
                                    placeholder="Ex.: Necessário levar caixas térmicas."
                                    className="campo resize-y"
                                />
                            </Campo>
                        </SecaoFormulario>

                        <SecaoFormulario
                            id="etapa-contato"
                            numero={4}
                            total={etapas.length}
                            icone={UserIcon}
                            titulo="Contato do doador"
                            descricao="Usado para combinar a entrega depois que um pedido for aceito. Preenchemos com os dados do seu perfil."
                            completa={etapaCompleta("etapa-contato")}
                        >
                            <div className="grid gap-5 sm:grid-cols-2">
                                <Campo id="doador" rotulo="Doador ou estabelecimento" erro={erros.doador}>
                                    <input
                                        type="text"
                                        id="doador"
                                        name="doador"
                                        value={form.doador}
                                        onChange={handleChange}
                                        autoComplete="organization"
                                        className="campo"
                                        {...atributosErro(erros, "doador")}
                                    />
                                </Campo>

                                <Campo id="contato" rotulo="Telefone / WhatsApp" erro={erros.contato}>
                                    <input
                                        type="tel"
                                        id="contato"
                                        name="contato"
                                        value={form.contato}
                                        onChange={(event) => setCampo("contato", formatarTelefone(event.target.value))}
                                        placeholder="(11) 99999-9999"
                                        autoComplete="tel"
                                        className="campo"
                                        {...atributosErro(erros, "contato")}
                                    />
                                </Campo>
                            </div>
                        </SecaoFormulario>

                        <SecaoFormulario
                            id="etapa-publicar"
                            numero={5}
                            total={etapas.length}
                            icone={ShieldIcon}
                            titulo="Revisar e publicar"
                            descricao="Confira a prévia e confirme que o alimento está em boas condições."
                            completa={etapaCompleta("etapa-publicar")}
                        >
                            <div className="flex flex-col gap-2">
                                <label
                                    className={`flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-4 text-sm transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-forest/30 ${form.declaracao
                                        ? "border-forest bg-forest/5"
                                        : erros.declaracao ? "border-terracotta-dark/40 bg-cream" : "border-transparent bg-cream hover:border-forest/40"
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        id="declaracao"
                                        checked={form.declaracao}
                                        onChange={(event) => setCampo("declaracao", event.target.checked)}
                                        className="mt-0.5 h-5 w-5 flex-none accent-forest"
                                        {...atributosErro(erros, "declaracao")}
                                    />
                                    <span className="leading-relaxed text-ink">
                                        <span className="font-semibold">Declaro que o alimento está dentro da validade, bem conservado e próprio para consumo.</span>{" "}
                                        <span className="text-ink-soft">Essa confirmação dá segurança a quem vai receber.</span>
                                    </span>
                                </label>

                                {erros.declaracao && (
                                    <p id="declaracao-erro" className="text-sm text-terracotta-dark">
                                        {erros.declaracao}
                                    </p>
                                )}
                            </div>

                            {erroGeral && (
                                <p role="alert" className="aviso-erro flex items-start gap-2">
                                    <AlertIcon className="mt-0.5 h-4 w-4 flex-none" />
                                    {erroGeral}
                                </p>
                            )}

                            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <Link to="/doacoes" className="btn-outline">
                                    Cancelar
                                </Link>
                                <button type="submit" className="btn-primary sm:min-w-56" disabled={carregandoImagem}>
                                    {carregandoImagem ? (
                                        <>
                                            <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                            Aguardando a foto...
                                        </>
                                    ) : (
                                        <>
                                            Publicar doação
                                            <ArrowIcon className="h-4 w-4" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </SecaoFormulario>
                    </form>

                    <aside aria-label="Prévia e progresso" className="hidden flex-col gap-6 lg:sticky lg:top-24 lg:flex">
                        <div>
                            <p className="eyebrow">Prévia do anúncio</p>
                            <p className="mb-3 mt-1 text-sm text-ink-soft">É assim que sua doação vai aparecer.</p>
                            <PreviaDoacao form={form} />
                        </div>

                        <ProgressoCadastro etapas={etapas} preenchidos={preenchidos} total={total} />

                        <section aria-labelledby="dicas-titulo" className="hidden rounded-3xl [@media(min-height:900px)]:block bg-forest/5 p-6 ring-1 ring-forest/10">
                            <h2 id="dicas-titulo" className="text-base font-semibold">Dicas para uma boa doação</h2>
                            <ul className="mt-3 flex flex-col gap-2.5 text-sm text-ink-soft">
                                {DICAS.map((dica) => (
                                    <li key={dica} className="flex gap-2">
                                        <CheckIcon aria-hidden="true" className="mt-0.5 h-4 w-4 flex-none text-forest" />
                                        {dica}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </aside>
                </div>
            </FundoPagina>
        </main>
    );
}

export default NovaDoacao;
