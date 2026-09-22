import { useState } from "react";
import { getUsuarios, saveUsuarios } from "../../services/usuariosStorage";

function CadastroForm() {

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [erro, setErro] = useState("");

    function handleSubmit(event) {
    event.preventDefault();

    setErro("");

    if (!nome.trim()) {
        setErro("O nome é obrigatório.");
        return;
    }

    if (!email.trim()) {
        setErro("O e-mail é obrigatório.");
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
        (usuario) => usuario.email.toLowerCase() === email.trim().toLowerCase()
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

    console.log("Usuário cadastrado:", novoUsuario);
    }

    return (
        <form onSubmit={handleSubmit}>

            {erro && <p>{erro}</p>}

             <div>
                <label htmlFor="nome">Nome</label>
                <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={nome}
                    onChange={(event) => setNome(event.target.value)}
                />
            </div>

            <div>
                <label htmlFor="email">E-mail</label>
                            <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
            />
            </div>

            <div>
                <label htmlFor="senha">Senha</label>
                <input
                    type="password"
                    id="senha"
                    name="senha"
                    value={senha}
                    onChange={(event) => setSenha(event.target.value)}
                />
            </div>

            <div>
                <label htmlFor="confirmarSenha">
                    Confirmar senha
                </label>
                <input
                    type="password"
                    id="confirmarSenha"
                    name="confirmarSenha"
                    value={confirmarSenha}
                    onChange={(event) => setConfirmarSenha(event.target.value)}
                />
            </div>

            <button type="submit">
                Criar conta
            </button>
        </form>
    );
}

export default CadastroForm;