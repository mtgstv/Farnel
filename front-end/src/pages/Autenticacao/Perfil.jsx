import { useState } from "react";
import { Link } from "react-router-dom";
import { Campo, Secao } from "../../components/Formulario";
import FaixaTopo from "../../components/FaixaTopo";
import { atributosErro } from "../../components/atributosErro";
import CampoSenha from "../../components/CampoSenha";
import { getUsuarioLogado, loginAutomatico } from "../../services/authStorage";
import { atualizarUsuario, emailEmUso, getUsuarioPorId } from "../../services/usuariosStorage";
import { getDoacoes } from "../../services/doacoesStorage";
import { getSolicitacoes } from "../../services/solicitacoesStorage";
import { getFavoritos } from "../../services/favoritosStorage";
import { comprimirImagem } from "../../services/imagem";
import { formatarTelefone, telefoneValido } from "../../services/formatacao";
import { CATEGORIAS, ESTADOS, PERFIS_USUARIO } from "../../data/opcoesDoacao";

const AVISOS = [
    { id: "novasDoacoes", rotulo: "Novas doações na minha cidade" },
    { id: "pedidosRecebidos", rotulo: "Quando alguém solicitar uma doação minha" },
    { id: "lembretesValidade", rotulo: "Lembretes quando minhas doações estiverem perto de vencer" },
];

const AVISOS_PADRAO = { novasDoacoes: true, pedidosRecebidos: true, lembretesValidade: true };

// O que pode ser editado no formulário, a partir do cadastro salvo.
function dadosDoPerfil(usuario) {
    return {
        nome: usuario.nome ?? "",
        email: usuario.email ?? "",
        telefone: usuario.telefone ?? "",
        perfil: usuario.perfil ?? "Pessoa física",
        organizacao: usuario.organizacao ?? "",
        sobre: usuario.sobre ?? "",
        cidade: usuario.cidade ?? "",
        uf: usuario.uf ?? "",
        endereco: usuario.endereco ?? "",
        horario: usuario.horario ?? "",
        interesses: usuario.interesses ?? [],
        avisos: { ...AVISOS_PADRAO, ...usuario.avisos },
        foto: usuario.foto ?? null,
    };
}

function validarPerfil(form, usuarioId) {
    const erros = {};

    if (form.nome.trim().length < 2) erros.nome = "Informe seu nome.";

    if (!form.email.includes("@")) erros.email = "Digite um e-mail válido.";
    else if (emailEmUso(form.email, usuarioId)) erros.email = "Este e-mail já está em uso por outra conta.";

    if (form.telefone && !telefoneValido(form.telefone)) erros.telefone = "Informe o telefone com DDD.";

    if (form.perfil !== "Pessoa física" && !form.organizacao.trim()) {
        erros.organizacao = "Informe o nome do estabelecimento ou da instituição.";
    }

    return erros;
}

function Iniciais({ nome }) {
    const letras = nome.trim().split(/\s+/).slice(0, 2).map((parte) => parte[0]?.toUpperCase()).join("");
    return <span className="font-heading text-4xl font-semibold text-cream">{letras || "?"}</span>;
}

// ---------- Cartão da esquerda: foto, apresentação e números ----------

function CartaoApresentacao({ usuario, form, onFoto, onRemoverFoto, erroFoto, carregandoFoto }) {
    const membroDesde = usuario.id > 1e12
        ? new Date(usuario.id).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
        : null;

    const numeros = [
        { valor: getDoacoes().filter((doacao) => doacao.usuarioId === usuario.id).length, rotulo: "Doações", para: "/minhas-doacoes" },
        { valor: getSolicitacoes().filter((pedido) => pedido.solicitanteId === usuario.id).length, rotulo: "Pedidos", para: "/solicitacoes" },
        { valor: getFavoritos().length, rotulo: "Favoritos", para: "/favoritos" },
    ];

    return (
        <aside className="overflow-hidden rounded-3xl bg-white shadow-card lg:sticky lg:top-24">
            <div className="relative h-24 bg-forest">
                <div aria-hidden="true" className="absolute -right-8 -top-10 h-32 w-32 rounded-full border-2 border-cream/15" />
            </div>

            <div className="-mt-14 flex flex-col items-center px-6 pb-6 text-center">
                <div className="relative">
                    <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-forest-light ring-4 ring-white">
                        {form.foto ? (
                            <img src={form.foto} alt="Sua foto de perfil" className="h-full w-full object-cover" />
                        ) : (
                            <Iniciais nome={form.nome} />
                        )}
                    </div>

                    <label
                        title="Trocar foto"
                        className="absolute bottom-0 right-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-terracotta text-white shadow-card transition hover:bg-terracotta-hover has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-forest/40"
                    >
                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-4 w-4">
                            <path d="M4 8h3l2-2.5h6L17 8h3v11H4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                            <circle cx="12" cy="13" r="3.2" stroke="currentColor" strokeWidth="1.8" />
                        </svg>
                        <input type="file" accept="image/*" onChange={onFoto} disabled={carregandoFoto} className="sr-only" aria-label="Escolher foto de perfil" />
                    </label>
                </div>

                {carregandoFoto && <p className="mt-2 text-xs text-ink-soft">Carregando foto...</p>}
                {erroFoto && <p className="mt-2 text-xs text-terracotta-dark">{erroFoto}</p>}
                {form.foto && (
                    <button type="button" onClick={onRemoverFoto} className="mt-2 text-xs font-semibold text-ink-soft hover:text-terracotta-dark">
                        Remover foto
                    </button>
                )}

                <h2 className="mt-3 text-xl font-semibold">{form.nome || "Seu nome"}</h2>
                {form.organizacao && form.perfil !== "Pessoa física" && (
                    <p className="text-sm font-medium text-ink">{form.organizacao}</p>
                )}
                <p className="text-sm text-ink-soft">{form.email}</p>

                <div className="mt-3 flex flex-wrap justify-center gap-2">
                    <span className="rounded-full bg-forest/10 px-3 py-1 text-xs font-semibold text-forest-dark">{form.perfil}</span>
                    {usuario.tipo === "admin" && (
                        <span className="rounded-full bg-terracotta/10 px-3 py-1 text-xs font-semibold text-terracotta-dark">Administrador</span>
                    )}
                </div>

                {form.sobre && <p className="mt-4 text-sm leading-relaxed text-ink-soft">{form.sobre}</p>}
                {(form.cidade || form.uf) && (
                    <p className="mt-2 text-xs font-medium text-ink-soft">
                        📍 {[form.cidade, form.uf].filter(Boolean).join("/")}
                    </p>
                )}
                {membroDesde && <p className="mt-1 text-xs text-ink-soft">Membro desde {membroDesde}</p>}

                <div className="mt-6 grid w-full grid-cols-3 gap-2 border-t border-line pt-5">
                    {numeros.map(({ valor, rotulo, para }) => (
                        <Link key={rotulo} to={para} className="rounded-xl py-2 transition hover:bg-cream">
                            <span className="block font-heading text-2xl font-semibold text-forest-dark">{valor}</span>
                            <span className="text-xs font-semibold text-ink-soft">{rotulo}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </aside>
    );
}

// ---------- Troca de senha (separada do resto do perfil) ----------

function TrocarSenha({ usuarioId }) {
    const [senhas, setSenhas] = useState({ atual: "", nova: "", confirmacao: "" });
    const [erros, setErros] = useState({});
    const [sucesso, setSucesso] = useState(false);

    function handleChange(event) {
        setSenhas((atuais) => ({ ...atuais, [event.target.name]: event.target.value }));
        setSucesso(false);
    }

    function handleSubmit(event) {
        event.preventDefault();

        const novosErros = {};
        if (senhas.atual !== getUsuarioPorId(usuarioId)?.senha) novosErros.atual = "Senha atual incorreta.";
        if (senhas.nova.length < 6) novosErros.nova = "A nova senha deve ter pelo menos 6 caracteres.";
        else if (senhas.nova === senhas.atual) novosErros.nova = "A nova senha deve ser diferente da atual.";
        if (senhas.confirmacao !== senhas.nova) novosErros.confirmacao = "As senhas não são iguais.";

        setErros(novosErros);
        if (Object.keys(novosErros).length > 0) return;

        atualizarUsuario(usuarioId, { senha: senhas.nova });
        setSenhas({ atual: "", nova: "", confirmacao: "" });
        setSucesso(true);
    }

    const campos = [
        { nome: "atual", rotulo: "Senha atual", autoComplete: "current-password" },
        { nome: "nova", rotulo: "Nova senha", autoComplete: "new-password" },
        { nome: "confirmacao", rotulo: "Confirmar nova senha", autoComplete: "new-password" },
    ];

    return (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5 rounded-3xl bg-white p-6 shadow-card sm:p-8">
            <div>
                <h2 className="text-xl font-semibold">Segurança</h2>
                <p className="mt-1 text-sm text-ink-soft">Troque a senha que você usa para entrar no Farnel.</p>
            </div>

            {sucesso && (
                <p role="status" className="aviso-sucesso">
                    Senha alterada com sucesso.
                </p>
            )}

            <div className="grid gap-5 md:grid-cols-3">
                {campos.map(({ nome, rotulo, autoComplete }) => (
                    <Campo key={nome} id={nome} rotulo={rotulo} erro={erros[nome]}>
                        <CampoSenha
                            id={nome}
                            name={nome}
                            value={senhas[nome]}
                            onChange={handleChange}
                            autoComplete={autoComplete}
                            {...atributosErro(erros, nome)}
                        />
                    </Campo>
                ))}
            </div>

            <button type="submit" className="btn-outline self-start">
                Alterar senha
            </button>
        </form>
    );
}

// ---------- Página ----------

function Perfil() {
    const sessao = getUsuarioLogado();
    const usuario = getUsuarioPorId(sessao.id) ?? sessao;

    const [form, setForm] = useState(() => dadosDoPerfil(usuario));
    const [erros, setErros] = useState({});
    const [salvo, setSalvo] = useState(false);
    const [erroFoto, setErroFoto] = useState("");
    const [carregandoFoto, setCarregandoFoto] = useState(false);

    function setCampo(nome, valor) {
        setForm((atual) => ({ ...atual, [nome]: valor }));
        setSalvo(false);
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

    function alternarInteresse(categoria) {
        setCampo(
            "interesses",
            form.interesses.includes(categoria)
                ? form.interesses.filter((item) => item !== categoria)
                : [...form.interesses, categoria]
        );
    }

    async function handleFoto(event) {
        const arquivo = event.target.files[0];
        event.target.value = "";
        setErroFoto("");
        if (!arquivo) return;

        if (!arquivo.type.startsWith("image/")) {
            setErroFoto("Escolha um arquivo de imagem.");
            return;
        }

        setCarregandoFoto(true);
        try {
            // pequena e quadrada o bastante para o avatar, para não pesar no armazenamento
            setCampo("foto", await comprimirImagem(arquivo, 320, 0.8));
        } catch {
            setErroFoto("Não foi possível carregar essa imagem.");
        } finally {
            setCarregandoFoto(false);
        }
    }

    function handleSubmit(event) {
        event.preventDefault();

        const novosErros = validarPerfil(form, usuario.id);
        setErros(novosErros);

        const primeiroErro = Object.keys(novosErros)[0];
        if (primeiroErro) {
            document.getElementById(primeiroErro)?.focus();
            return;
        }

        const atualizado = atualizarUsuario(usuario.id, {
            ...form,
            nome: form.nome.trim(),
            email: form.email.trim(),
            organizacao: form.perfil === "Pessoa física" ? "" : form.organizacao.trim(),
            sobre: form.sobre.trim(),
            cidade: form.cidade.trim(),
            endereco: form.endereco.trim(),
            horario: form.horario.trim(),
        });

        // atualiza a sessão (e o header) com o nome, e-mail e foto novos
        loginAutomatico(atualizado ?? { ...sessao, ...form });
        setSalvo(true);
    }

    return (
        <div className="min-h-screen">
            <FaixaTopo
                eyebrow="Minha conta"
                titulo="Meu perfil"
                descricao="Mantenha seus dados atualizados: eles aparecem para quem recebe suas doações e já preenchem os formulários para você."
            />

            <main className="bg-cream py-10 md:py-14">
                <div className="container-largo">
                    <div className="grid items-start gap-8 lg:grid-cols-[320px_1fr]">
                        <CartaoApresentacao
                            usuario={usuario}
                            form={form}
                            onFoto={handleFoto}
                            onRemoverFoto={() => setCampo("foto", null)}
                            erroFoto={erroFoto}
                            carregandoFoto={carregandoFoto}
                        />

                        <div className="flex flex-col gap-8">
                            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8 rounded-3xl bg-white p-6 shadow-card sm:p-8">
                                <Secao titulo="Dados pessoais">
                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <Campo id="nome" rotulo="Nome" erro={erros.nome}>
                                            <input type="text" id="nome" name="nome" value={form.nome} onChange={handleChange} autoComplete="name" className="campo" {...atributosErro(erros, "nome")} />
                                        </Campo>
                                        <Campo id="email" rotulo="E-mail" erro={erros.email}>
                                            <input type="email" id="email" name="email" value={form.email} onChange={handleChange} autoComplete="email" className="campo" {...atributosErro(erros, "email")} />
                                        </Campo>
                                        <Campo id="telefone" rotulo="Telefone / WhatsApp" opcional erro={erros.telefone}>
                                            <input
                                                type="tel"
                                                id="telefone"
                                                name="telefone"
                                                value={form.telefone}
                                                onChange={(event) => setCampo("telefone", formatarTelefone(event.target.value))}
                                                placeholder="(11) 99999-9999"
                                                autoComplete="tel"
                                                className="campo"
                                                {...atributosErro(erros, "telefone")}
                                            />
                                        </Campo>
                                        <Campo id="perfil" rotulo="Você participa como">
                                            <select id="perfil" name="perfil" value={form.perfil} onChange={handleChange} className="campo">
                                                {PERFIS_USUARIO.map((perfil) => (
                                                    <option key={perfil} value={perfil}>{perfil}</option>
                                                ))}
                                            </select>
                                        </Campo>
                                    </div>

                                    {form.perfil !== "Pessoa física" && (
                                        <Campo
                                            id="organizacao"
                                            rotulo={form.perfil === "ONG ou instituição" ? "Nome da instituição" : "Nome do estabelecimento ou produtor"}
                                            erro={erros.organizacao}
                                            dica="Aparece como doador nas suas doações."
                                        >
                                            <input type="text" id="organizacao" name="organizacao" value={form.organizacao} onChange={handleChange} autoComplete="organization" className="campo" {...atributosErro(erros, "organizacao")} />
                                        </Campo>
                                    )}

                                    <Campo id="sobre" rotulo="Sobre você" opcional dica={`${form.sobre.length}/300 caracteres`}>
                                        <textarea
                                            id="sobre"
                                            name="sobre"
                                            value={form.sobre}
                                            onChange={handleChange}
                                            rows={3}
                                            maxLength={300}
                                            placeholder="Ex.: Padaria de bairro que doa o excedente do dia desde 2020."
                                            className="campo resize-y"
                                        />
                                    </Campo>
                                </Secao>

                                <Secao titulo="Localização e retirada" descricao="Usados para preencher automaticamente suas novas doações e solicitações.">
                                    <div className="grid gap-5 sm:grid-cols-[3fr_1fr]">
                                        <Campo id="cidade" rotulo="Cidade" opcional>
                                            <input type="text" id="cidade" name="cidade" value={form.cidade} onChange={handleChange} autoComplete="address-level2" className="campo" />
                                        </Campo>
                                        <Campo id="uf" rotulo="Estado" opcional>
                                            <select id="uf" name="uf" value={form.uf} onChange={handleChange} autoComplete="address-level1" className="campo">
                                                <option value="">UF</option>
                                                {ESTADOS.map((uf) => (
                                                    <option key={uf} value={uf}>{uf}</option>
                                                ))}
                                            </select>
                                        </Campo>
                                    </div>
                                    <Campo id="endereco" rotulo="Endereço de retirada" opcional>
                                        <input type="text" id="endereco" name="endereco" value={form.endereco} onChange={handleChange} placeholder="Rua, número, bairro" autoComplete="street-address" className="campo" />
                                    </Campo>
                                    <Campo id="horario" rotulo="Dias e horários disponíveis" opcional>
                                        <input type="text" id="horario" name="horario" value={form.horario} onChange={handleChange} placeholder="Ex.: Seg. a sex., das 8h às 17h" className="campo" />
                                    </Campo>
                                </Secao>

                                <Secao titulo="Preferências">
                                    <div className="flex flex-col gap-3">
                                        <p className="rotulo">
                                            Categorias que mais te interessam{" "}
                                            <span className="font-normal text-ink-soft">(para destacar doações desses tipos)</span>
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {CATEGORIAS.map((categoria) => {
                                                const marcada = form.interesses.includes(categoria);
                                                return (
                                                    <label
                                                        key={categoria}
                                                        className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-forest/30 ${marcada
                                                            ? "border-forest bg-forest text-white"
                                                            : "border-line bg-cream text-ink-soft hover:border-forest/40"
                                                            }`}
                                                    >
                                                        <input type="checkbox" checked={marcada} onChange={() => alternarInteresse(categoria)} className="sr-only" />
                                                        {categoria}
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <p className="rotulo">Quero receber avisos sobre</p>
                                        {AVISOS.map(({ id, rotulo }) => (
                                            <label key={id} className="flex cursor-pointer items-center gap-3 text-sm text-ink">
                                                <input
                                                    type="checkbox"
                                                    checked={form.avisos[id]}
                                                    onChange={(event) => setCampo("avisos", { ...form.avisos, [id]: event.target.checked })}
                                                    className="h-4 w-4 flex-none accent-forest"
                                                />
                                                {rotulo}
                                            </label>
                                        ))}
                                    </div>
                                </Secao>

                                <div className="flex flex-col-reverse items-stretch gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-end">
                                    {salvo && (
                                        <p role="status" className="text-sm font-semibold text-forest-dark sm:mr-auto">
                                            ✓ Alterações salvas.
                                        </p>
                                    )}
                                    <button type="submit" className="btn-primary" disabled={carregandoFoto}>
                                        Salvar alterações
                                    </button>
                                </div>
                            </form>

                            <TrocarSenha usuarioId={usuario.id} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Perfil;
