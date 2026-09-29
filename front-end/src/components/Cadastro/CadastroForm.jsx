import { useState } from "react";
import { getUsuarios, saveUsuarios } from "../../services/usuariosStorage";
import { loginAutomatico } from "../../services/authStorage";

function CadastroForm() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");

    function handleSubmit(event) {
        event.preventDefault();

        setErro("");
        setSucesso("");

        if (!nome.trim()) {
            setErro("O nome é obrigatório.");
            return;
        }

        if (!email.trim()) {
            setErro("O e-mail é obrigatório.");
            return;
        }

        if (!email.includes("@")) {
            setErro("Digite um e-mail válido.");
            return;
        }

        if (senha.length < 6) {
            setErro("A senha deve ter pelo menos 6 caracteres.");
            return;
        }

        if (senha !== confirmarSenha) {
            setErro("As senhas não são iguais.");
            return;
        }

        const usuarios = getUsuarios();

        const emailExiste = usuarios.some(
            (usuario) =>
                usuario.email.toLowerCase() ===
                email.trim().toLowerCase()
        );

        if (emailExiste) {
            setErro("Este e-mail já está cadastrado.");
            return;
        }

        const novoUsuario = {
            id: Date.now(),
            nome: nome.trim(),
            email: email.trim(),
            senha: senha,
        };

        usuarios.push(novoUsuario);

        saveUsuarios(usuarios);

        loginAutomatico(novoUsuario);

        setSucesso("Cadastro realizado com sucesso!");

        setNome("");
        setEmail("");
        setSenha("");
        setConfirmarSenha("");

        console.log("Usuário cadastrado:", novoUsuario);
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
        >
            {erro && (
                <p className="rounded-xl bg-terracotta/10 px-4 py-3 text-sm text-terracotta-dark">
                    {erro}
                </p>
            )}

            {sucesso && (
                <p className="rounded-xl bg-forest/10 px-4 py-3 text-sm text-forest-dark">
                    {sucesso}
                </p>
            )}

            <div className="flex flex-col gap-2">
                <label
                    htmlFor="nome"
                    className="text-sm font-semibold text-ink"
                >
                    Nome
                </label>

                <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={nome}
                    onChange={(event) => setNome(event.target.value)}
                    autoComplete="name"
                    required
                    className="w-full rounded-xl border border-line bg-cream px-4 py-3 text-ink outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/15"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label
                    htmlFor="email"
                    className="text-sm font-semibold text-ink"
                >
                    E-mail
                </label>

                <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    required
                    className="w-full rounded-xl border border-line bg-cream px-4 py-3 text-ink outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/15"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label
                    htmlFor="senha"
                    className="text-sm font-semibold text-ink"
                >
                    Senha
                </label>

                <input
                    type="password"
                    id="senha"
                    name="senha"
                    value={senha}
                    onChange={(event) => setSenha(event.target.value)}
                    autoComplete="new-password"
                    required
                    className="w-full rounded-xl border border-line bg-cream px-4 py-3 text-ink outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/15"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label
                    htmlFor="confirmarSenha"
                    className="text-sm font-semibold text-ink"
                >
                    Confirmar senha
                </label>

                <input
                    type="password"
                    id="confirmarSenha"
                    name="confirmarSenha"
                    value={confirmarSenha}
                    onChange={(event) =>
                        setConfirmarSenha(event.target.value)
                    }
                    autoComplete="new-password"
                    required
                    className="w-full rounded-xl border border-line bg-cream px-4 py-3 text-ink outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/15"
                />
            </div>

            <button
                type="submit"
                className="btn-primary mt-2 w-full"
            >
                Criar conta
            </button>
        </form>
    );
}

export default CadastroForm;