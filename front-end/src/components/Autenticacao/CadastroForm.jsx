import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Campo } from "../Formulario/Formulario";
import CampoSenha from "../Formulario/CampoSenha";
import { atributosErro } from "../Formulario/atributosErro";
import { emailEmUso, getUsuarios, saveUsuarios } from "../../services/usuariosStorage";
import { loginAutomatico } from "../../services/authStorage";
import { useDestinoAposLogin } from "../../hooks/useDestinoAposLogin";
import { emailValido } from "../../services/formatacao";

// Retorna { campo: "mensagem" } com os erros, na ordem em que aparecem na tela.
function validar(form) {
    const erros = {};

    if (!form.nome.trim()) erros.nome = "O nome é obrigatório.";

    if (!form.email.trim()) erros.email = "O e-mail é obrigatório.";
    else if (!emailValido(form.email)) erros.email = "Digite um e-mail válido.";
    else if (emailEmUso(form.email)) erros.email = "Este e-mail já está cadastrado.";

    if (form.senha.length < 6) erros.senha = "A senha deve ter pelo menos 6 caracteres.";
    if (form.confirmarSenha !== form.senha) erros.confirmarSenha = "As senhas não são iguais.";

    return erros;
}

function CadastroForm() {
    const [form, setForm] = useState({ nome: "", email: "", senha: "", confirmarSenha: "" });
    const [erros, setErros] = useState({});
    const navigate = useNavigate();
    const destino = useDestinoAposLogin();

    function handleChange(event) {
        const { name, value } = event.target;
        setForm((atual) => ({ ...atual, [name]: value }));
        setErros((atuais) => {
            if (!atuais[name]) return atuais;
            const novos = { ...atuais };
            delete novos[name];
            return novos;
        });
    }

    function handleSubmit(event) {
        event.preventDefault();

        const novosErros = validar(form);
        setErros(novosErros);

        const primeiroErro = Object.keys(novosErros)[0];
        if (primeiroErro) {
            document.getElementById(primeiroErro)?.focus();
            return;
        }

        const novoUsuario = {
            id: Date.now(),
            nome: form.nome.trim(),
            email: form.email.trim(),
            senha: form.senha,
            tipo: "doador",
        };

        if (!saveUsuarios([...getUsuarios(), novoUsuario])) return; // armazenamento cheio: o aviso aparece sozinho
        loginAutomatico(novoUsuario);

        // já entra na conta e segue para a home (ou para a página que tentou abrir)
        navigate(destino, { replace: true });
    }

    return (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            <Campo id="nome" rotulo="Nome" erro={erros.nome}>
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

            <Campo id="email" rotulo="E-mail" erro={erros.email}>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="seu.email@exemplo.com"
                    autoComplete="email"
                    className="campo"
                    {...atributosErro(erros, "email")}
                />
            </Campo>

            <Campo id="senha" rotulo="Senha" erro={erros.senha} dica="Mínimo de 6 caracteres.">
                <CampoSenha
                    id="senha"
                    name="senha"
                    value={form.senha}
                    onChange={handleChange}
                    autoComplete="new-password"
                    {...atributosErro(erros, "senha")}
                />
            </Campo>

            <Campo id="confirmarSenha" rotulo="Confirmar senha" erro={erros.confirmarSenha}>
                <CampoSenha
                    id="confirmarSenha"
                    name="confirmarSenha"
                    value={form.confirmarSenha}
                    onChange={handleChange}
                    autoComplete="new-password"
                    {...atributosErro(erros, "confirmarSenha")}
                />
            </Campo>

            <button type="submit" className="btn-primary mt-1 w-full">
                Criar conta
            </button>
        </form>
    );
}

export default CadastroForm;
