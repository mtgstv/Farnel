import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Campo } from "../Formulario/Formulario";
import CampoSenha from "../Formulario/CampoSenha";
import { atributosErro } from "../Formulario/atributosErro";
import { useDestinoAposLogin } from "../../hooks/useDestinoAposLogin";
import { useAuth } from "../../hooks/useAuth";
import { emailValido } from "../../services/formatacao";

// Retorna { campo: "mensagem" } com os erros, na ordem em que aparecem na tela.
// São as mesmas regras da API (que confere tudo de novo e também avisa se o e-mail já tem conta).
function validar(form) {
    const erros = {};

    if (!form.nome.trim()) erros.nome = "O nome é obrigatório.";

    if (!form.email.trim()) erros.email = "O e-mail é obrigatório.";
    else if (!emailValido(form.email)) erros.email = "Digite um e-mail válido.";

    if (form.senha.length < 8) erros.senha = "A senha deve ter pelo menos 8 caracteres.";
    else if (form.senha.length > 72) erros.senha = "A senha pode ter no máximo 72 caracteres.";
    if (form.confirmarSenha !== form.senha) erros.confirmarSenha = "As senhas não são iguais.";

    return erros;
}

function CadastroForm() {
    const [form, setForm] = useState({ nome: "", email: "", senha: "", confirmarSenha: "" });
    const [erros, setErros] = useState({});
    const [erroGeral, setErroGeral] = useState("");
    const [enviando, setEnviando] = useState(false);
    const navigate = useNavigate();
    const destino = useDestinoAposLogin();
    const { cadastrar } = useAuth();

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

    function mostrarErros(novosErros) {
        setErros(novosErros);
        const primeiroErro = Object.keys(novosErros)[0];
        if (primeiroErro) document.getElementById(primeiroErro)?.focus();
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setErroGeral("");

        const novosErros = validar(form);
        if (Object.keys(novosErros).length > 0) {
            mostrarErros(novosErros);
            return;
        }

        setEnviando(true);
        try {
            await cadastrar({ nome: form.nome.trim(), email: form.email.trim(), senha: form.senha });
            // já entra na conta e segue para a home (ou para a página que tentou abrir)
            navigate(destino, { replace: true });
        } catch (erro) {
            setEnviando(false);
            if (erro.campos) {
                mostrarErros(erro.campos); // 400: a API diz o que está errado em cada campo
            } else if (erro.status === 409) {
                mostrarErros({ email: erro.message }); // e-mail que já tem conta
            } else {
                setErroGeral(erro.message); // servidor fora do ar, muitas tentativas...
            }
        }
    }

    return (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            {erroGeral && (
                <p role="alert" className="aviso-erro">
                    {erroGeral}
                </p>
            )}

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

            <Campo id="senha" rotulo="Senha" erro={erros.senha} dica="Mínimo de 8 caracteres.">
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

            <button type="submit" className="btn-primary mt-1 w-full" disabled={enviando}>
                {enviando ? "Criando conta..." : "Criar conta"}
            </button>
        </form>
    );
}

export default CadastroForm;
