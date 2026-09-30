import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Campo, Secao } from "../../components/Formulario";
import PaginaCentralizada from "../../components/PaginaCentralizada";
import { atributosErro } from "../../components/atributosErro";
import FotoDoacao from "../../components/Doacoes/FotoDoacao";
import { PinIcon } from "../../components/Icons";
import { getUsuarioLogado } from "../../services/authStorage";
import { getUsuarioPorId } from "../../services/usuariosStorage";
import { getDoacoes } from "../../services/doacoesStorage";
import { adicionarSolicitacao, pedidoEmAberto } from "../../services/solicitacoesStorage";
import { diasAteVencer, ordenarDoacoes, statusDaDoacao, textoVencimento } from "../../services/ordenacaoDoacoes";
import { formatarTelefone, hojeISO, paraDataBR, paraDataISO, telefoneValido } from "../../services/formatacao";
import { FORMAS_RECEBIMENTO, TIPOS_SOLICITANTE } from "../../data/opcoesDoacao";

// Forma de recebimento sugerida a partir de como o doador disse que seria a retirada.
function formaSugerida(doacao) {
    if (doacao?.tipoRetirada === "Retirada no local") return "Vou retirar no local";
    if (doacao?.tipoRetirada === "Entrega pelo doador") return "Preciso de entrega";
    return "A combinar";
}

// Retorna { campo: "mensagem" } com os erros, na ordem em que aparecem na tela.
function validar(form, doacao, usuarioId) {
    const erros = {};

    if (!doacao) {
        erros.doacaoId = "Escolha a doação que você quer solicitar.";
    } else if (pedidoEmAberto(doacao.id, usuarioId)) {
        erros.doacaoId = "Você já tem um pedido em aberto para esta doação.";
    }

    if (form.nome.trim().length < 3) erros.nome = "Informe seu nome ou o da instituição.";
    if (!telefoneValido(form.contato)) erros.contato = "Informe um telefone com DDD.";
    if (!form.quantidade.trim()) erros.quantidade = "Informe quanto você precisa (ou \"tudo\").";

    if (!form.dataRetirada) {
        erros.dataRetirada = "Escolha uma data para a retirada.";
    } else if (form.dataRetirada < hojeISO()) {
        erros.dataRetirada = "A data não pode estar no passado.";
    } else if (doacao && form.dataRetirada > paraDataISO(doacao.validade)) {
        erros.dataRetirada = `A doação vence em ${doacao.validade}: escolha uma data até lá.`;
    }

    if (!form.compromisso) erros.compromisso = "Confirme o compromisso para enviar o pedido.";

    return erros;
}

// Resumo da doação escolhida.
function ResumoDoacao({ doacao }) {
    const dias = diasAteVencer(doacao.validade);

    return (
        <div className="flex flex-col overflow-hidden rounded-2xl bg-cream sm:flex-row">
            <FotoDoacao doacao={doacao} className="h-40 w-full flex-none sm:h-auto sm:w-48" />

            <div className="flex flex-1 flex-col gap-1 p-4">
                <p className="rotulo-categoria">{doacao.categoria}</p>
                <p className="font-heading text-lg font-semibold text-forest-dark">{doacao.titulo}</p>
                <p className="text-sm text-ink-soft">{doacao.quantidade} · doado por {doacao.doador}</p>
                <p className="flex items-center gap-1 text-sm text-ink-soft">
                    <PinIcon className="h-4 w-4 text-terracotta" />
                    {doacao.local} · {doacao.tipoRetirada}
                </p>
                <p className={`mt-1 text-sm font-semibold ${dias <= 3 ? "text-terracotta-dark" : "text-forest-dark"}`}>
                    {textoVencimento(dias)} ({doacao.validade})
                </p>
            </div>
        </div>
    );
}

function NovaSolicitacao() {
    const usuario = getUsuarioLogado();
    const perfil = getUsuarioPorId(usuario.id);
    const navigate = useNavigate();
    const [parametros] = useSearchParams();

    // Só dá para pedir doações disponíveis de outras pessoas.
    const disponiveis = ordenarDoacoes(
        getDoacoes().filter((doacao) => statusDaDoacao(doacao) === "Disponível" && doacao.usuarioId !== usuario.id),
        "validade"
    );
    const pedida = Number(parametros.get("doacao"));
    const pedidaDisponivel = disponiveis.some((doacao) => doacao.id === pedida);

    const [form, setForm] = useState(() => ({
        doacaoId: pedidaDisponivel ? String(pedida) : "",
        tipoSolicitante: perfil?.perfil === "ONG ou instituição" ? "ONG ou instituição" : "Pessoa física",
        nome: perfil?.organizacao || usuario.nome,
        contato: perfil?.telefone ?? "",
        quantidade: "",
        dataRetirada: "",
        horario: perfil?.horario ?? "",
        forma: formaSugerida(disponiveis.find((doacao) => doacao.id === pedida)),
        mensagem: "",
        compromisso: false,
    }));
    const [erros, setErros] = useState({});

    const doacao = disponiveis.find((item) => String(item.id) === form.doacaoId) ?? null;

    function setCampo(nome, valor) {
        setForm((atual) => ({ ...atual, [nome]: valor }));
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

    function handleTrocarDoacao(event) {
        const escolhida = disponiveis.find((item) => String(item.id) === event.target.value);
        setCampo("doacaoId", event.target.value);
        setCampo("forma", formaSugerida(escolhida));
    }

    function handleSubmit(event) {
        event.preventDefault();

        const novosErros = validar(form, doacao, usuario.id);
        setErros(novosErros);

        const primeiroErro = Object.keys(novosErros)[0];
        if (primeiroErro) {
            document.getElementById(primeiroErro)?.focus();
            return;
        }

        adicionarSolicitacao({
            id: Date.now(),
            doacaoId: doacao.id,
            doacaoTitulo: doacao.titulo,
            doadorId: doacao.usuarioId ?? null,
            doadorNome: doacao.doador,
            solicitanteId: usuario.id,
            solicitanteNome: form.nome.trim(),
            tipoSolicitante: form.tipoSolicitante,
            contato: form.contato,
            quantidade: form.quantidade.trim(),
            dataRetirada: paraDataBR(form.dataRetirada),
            horario: form.horario.trim(),
            forma: form.forma,
            mensagem: form.mensagem.trim(),
            status: "Pendente",
            dataCriacao: paraDataBR(hojeISO()),
        });

        navigate("/solicitacoes?aba=feitas", {
            state: { aviso: `Pedido enviado! O doador de "${doacao.titulo}" vai receber a sua solicitação.` },
        });
    }

    return (
        <PaginaCentralizada
            eyebrow="Solicitar doação"
            titulo="Nova solicitação"
            descricao="Conte ao doador quem vai receber o alimento e quando você pode buscar. Ele poderá aceitar o pedido e combinar os detalhes com você."
        >

            {disponiveis.length === 0 ? (
                <div className="rounded-3xl bg-white p-8 text-center shadow-card">
                    <h2 className="text-xl font-semibold">Nenhuma doação disponível agora</h2>
                    <p className="mt-2 text-sm text-ink-soft">Volte mais tarde para ver as novas doações.</p>
                    <Link to="/doacoes" className="btn-outline mt-6">Ver todas as doações</Link>
                </div>
            ) : (
                <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="cartao flex flex-col gap-8 p-6 sm:p-8 md:p-10"
                >
                    {parametros.get("doacao") && !pedidaDisponivel && (
                        <p role="alert" className="aviso-erro">
                            A doação escolhida não está mais disponível. Escolha outra abaixo.
                        </p>
                    )}

                    <Secao titulo="A doação">
                        <Campo id="doacaoId" rotulo="Qual doação você quer solicitar?" erro={erros.doacaoId}>
                            <select
                                id="doacaoId"
                                name="doacaoId"
                                value={form.doacaoId}
                                onChange={handleTrocarDoacao}
                                className="campo"
                                {...atributosErro(erros, "doacaoId")}
                            >
                                <option value="">Selecione...</option>
                                {disponiveis.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.titulo} — {item.local} (vence {item.validade})
                                    </option>
                                ))}
                            </select>
                        </Campo>

                        {doacao && <ResumoDoacao doacao={doacao} />}
                    </Secao>

                    <Secao titulo="Quem vai receber">
                        <div className="grid gap-5 sm:grid-cols-2">
                            <Campo id="tipoSolicitante" rotulo="Você está pedindo como">
                                <select
                                    id="tipoSolicitante"
                                    name="tipoSolicitante"
                                    value={form.tipoSolicitante}
                                    onChange={handleChange}
                                    className="campo"
                                >
                                    {TIPOS_SOLICITANTE.map((tipo) => (
                                        <option key={tipo} value={tipo}>{tipo}</option>
                                    ))}
                                </select>
                            </Campo>

                            <Campo id="nome" rotulo="Nome (seu ou da instituição)" erro={erros.nome}>
                                <input
                                    type="text"
                                    id="nome"
                                    name="nome"
                                    value={form.nome}
                                    onChange={handleChange}
                                    autoComplete="name"
                                    className="campo"
                                    {...atributosErro(erros, "nome")}
                                />
                            </Campo>
                        </div>

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
                    </Secao>

                    <Secao titulo="Retirada">
                        <Campo
                            id="quantidade"
                            rotulo="Quanto você precisa?"
                            erro={erros.quantidade}
                            dica={doacao ? `Disponível: ${doacao.quantidade}.` : undefined}
                        >
                            <input
                                type="text"
                                id="quantidade"
                                name="quantidade"
                                value={form.quantidade}
                                onChange={handleChange}
                                placeholder="Ex.: tudo, 10 kg, 5 caixas"
                                className="campo"
                                {...atributosErro(erros, "quantidade")}
                            />
                        </Campo>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <Campo id="dataRetirada" rotulo="Quando você pode buscar?" erro={erros.dataRetirada}>
                                <input
                                    type="date"
                                    id="dataRetirada"
                                    name="dataRetirada"
                                    value={form.dataRetirada}
                                    onChange={handleChange}
                                    min={hojeISO()}
                                    max={doacao ? paraDataISO(doacao.validade) : undefined}
                                    className="campo"
                                    {...atributosErro(erros, "dataRetirada")}
                                />
                            </Campo>

                            <Campo id="horario" rotulo="Horário" opcional>
                                <input
                                    type="text"
                                    id="horario"
                                    name="horario"
                                    value={form.horario}
                                    onChange={handleChange}
                                    placeholder="Ex.: depois das 14h"
                                    className="campo"
                                />
                            </Campo>
                        </div>

                        <div className="flex flex-col gap-3">
                            <p className="rotulo">Como você prefere receber?</p>
                            <div className="flex flex-wrap gap-2">
                                {FORMAS_RECEBIMENTO.map((forma) => {
                                    const marcada = form.forma === forma;
                                    return (
                                        <label
                                            key={forma}
                                            className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-forest/30 ${marcada
                                                ? "border-forest bg-forest text-white"
                                                : "border-line bg-cream text-ink-soft hover:border-forest/40"
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="forma"
                                                value={forma}
                                                checked={marcada}
                                                onChange={handleChange}
                                                className="sr-only"
                                            />
                                            {forma}
                                        </label>
                                    );
                                })}
                            </div>
                        </div>

                        <Campo id="mensagem" rotulo="Mensagem para o doador" opcional>
                            <textarea
                                id="mensagem"
                                name="mensagem"
                                value={form.mensagem}
                                onChange={handleChange}
                                rows={3}
                                maxLength={400}
                                placeholder="Ex.: Somos uma cozinha comunitária que serve 200 refeições por dia."
                                className="campo resize-y"
                            />
                        </Campo>
                    </Secao>

                    <div className="flex flex-col gap-2 rounded-2xl bg-cream p-5">
                        <label className="flex cursor-pointer items-start gap-3 text-sm text-ink">
                            <input
                                type="checkbox"
                                id="compromisso"
                                checked={form.compromisso}
                                onChange={(event) => setCampo("compromisso", event.target.checked)}
                                className="mt-0.5 h-4 w-4 flex-none accent-forest"
                                {...atributosErro(erros, "compromisso")}
                            />
                            <span>
                                Comprometo-me a buscar o alimento na data combinada e a destiná-lo a quem
                                precisa, sem revendê-lo.
                            </span>
                        </label>

                        {erros.compromisso && (
                            <p id="compromisso-erro" className="text-sm text-terracotta-dark">
                                {erros.compromisso}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <Link to="/solicitacoes" className="btn-outline">
                            Cancelar
                        </Link>
                        <button type="submit" className="btn-primary">
                            Enviar solicitação
                        </button>
                    </div>
                </form>
            )}
        </PaginaCentralizada>
    );
}

export default NovaSolicitacao;
