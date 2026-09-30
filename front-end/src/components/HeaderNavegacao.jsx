import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowIcon } from "./Icons";
import Marca from "./Marca";
import MenuSuspenso, { Seta } from "./MenuSuspenso";
import { logout } from "../services/authStorage";
import { useUsuarioLogado } from "../hooks/useUsuarioLogado";

/*
 * Header enxuto das páginas internas e da home de quem está logado.
 * Cada grupo abre um menu com as páginas relacionadas.
 */
function gruposDoMenu(usuario) {
  const logado = Boolean(usuario);

  const grupos = [
    {
      id: "doacoes",
      rotulo: "Doações",
      ativoEm: ["/doacoes", "/detalhes", "/minhas-doacoes", "/favoritos", "/solicitacoes"],
      itens: [
        { rotulo: "Doações disponíveis", descricao: "Veja o que está disponível para retirada", para: "/doacoes" },
        { rotulo: "Doar alimentos", descricao: "Cadastre um alimento para doação", para: "/doacoes/nova" },
        logado && { rotulo: "Histórico de doações", descricao: "Tudo o que você já doou", para: "/minhas-doacoes" },
        logado && { rotulo: "Favoritos", descricao: "Doações que você salvou", para: "/favoritos" },
        logado && { rotulo: "Solicitações", descricao: "Pedidos que você fez e recebeu", para: "/solicitacoes" },
      ].filter(Boolean),
    },
    {
      id: "instituicoes",
      rotulo: "Instituições",
      ativoEm: ["/instituicao"],
      itens: [
        { rotulo: "Área da instituição", descricao: "Para ONGs e cozinhas solidárias", para: "/instituicao" },
        { rotulo: "Doações recebidas", para: "/instituicao/doacoes" },
        { rotulo: "Solicitações da instituição", para: "/instituicao/solicitacoes" },
      ],
    },
    {
      id: "sobre",
      rotulo: "Sobre",
      ativoEm: ["/sobre"],
      itens: [
        { rotulo: "Sobre nós", descricao: "Quem somos e como atuamos", para: "/sobre#sobre-nos" },
        { rotulo: "Cidades atendidas", para: "/sobre#cidades" },
        { rotulo: "Lei do Doador", para: "/sobre#lei-do-doador" },
        { rotulo: "Contato", para: "/sobre#contato" },
      ],
    },
  ];

  if (usuario?.tipo === "admin") {
    grupos.push({
      id: "admin",
      rotulo: "Admin",
      ativoEm: ["/admin"],
      itens: [
        { rotulo: "Painel administrativo", para: "/admin" },
        { rotulo: "Gerenciar doações", para: "/admin/doacoes" },
        { rotulo: "Gerenciar instituições", para: "/admin/instituicoes" },
        { rotulo: "Gerenciar usuários", para: "/admin/usuarios" },
      ],
    });
  }

  return grupos;
}

const ITENS_USUARIO = [
  { rotulo: "Meu perfil", para: "/perfil" },
  { rotulo: "Histórico de doações", para: "/minhas-doacoes" },
  { rotulo: "Dashboard", para: "/dashboard" },
];

function grupoAtivo(grupo, pathname) {
  return grupo.ativoEm.some((prefixo) => pathname === prefixo || pathname.startsWith(`${prefixo}/`));
}

function HeaderNavegacao() {
  const [menuAberto, setMenuAberto] = useState(null); // id do menu suspenso aberto
  const [mobileAberto, setMobileAberto] = useState(false);
  const headerRef = useRef(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const usuario = useUsuarioLogado(); // atualiza ao entrar, sair ou editar o perfil
  const grupos = gruposDoMenu(usuario);
  const primeiroNome = usuario?.nome.split(" ")[0];

  // Fecha o menu suspenso ao clicar fora do header.
  useEffect(() => {
    if (!menuAberto) return;

    function handleClickFora(event) {
      if (!headerRef.current?.contains(event.target)) setMenuAberto(null);
    }

    document.addEventListener("mousedown", handleClickFora);
    return () => document.removeEventListener("mousedown", handleClickFora);
  }, [menuAberto]);

  function alternarMenu(id) {
    setMenuAberto((atual) => (atual === id ? null : id));
  }

  function fecharTudo() {
    setMenuAberto(null);
    setMobileAberto(false);
  }

  function handleSair() {
    logout();
    fecharTudo();
    navigate("/");
  }

  const botaoSair = (
    <button
      type="button"
      onClick={handleSair}
      className="block w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-terracotta-dark transition-colors hover:bg-cream"
    >
      Sair
    </button>
  );

  return (
    <header ref={headerRef} className="sticky top-0 z-50 border-b border-line/60 bg-cream/85 backdrop-blur-xl backdrop-saturate-150">
      <div className="container-page flex h-16 items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-2" onClick={fecharTudo}>
          <Marca compacta />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Principal">
          {grupos.map((grupo) => (
            <MenuSuspenso
              key={grupo.id}
              id={grupo.id}
              rotulo={grupo.rotulo}
              itens={grupo.itens}
              aberto={menuAberto === grupo.id}
              ativo={grupoAtivo(grupo, pathname)}
              onAlternar={() => alternarMenu(grupo.id)}
              onFechar={() => setMenuAberto(null)}
            />
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {usuario ? (
            <>
              <Link to="/doacoes/nova" className="btn-primary px-5 py-2.5">
                Doar
                <ArrowIcon className="h-4 w-4" />
              </Link>

              <MenuSuspenso
                id="usuario"
                rotulo={
                  <span className="flex items-center gap-2">
                    <span aria-hidden="true" className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-forest text-xs font-bold text-cream">
                      {usuario.foto ? (
                        <img src={usuario.foto} alt="" className="h-full w-full object-cover" />
                      ) : (
                        primeiroNome[0].toUpperCase()
                      )}
                    </span>
                    {primeiroNome}
                  </span>
                }
                rotuloAcessivel={`Minha conta (${primeiroNome})`}
                itens={ITENS_USUARIO}
                aberto={menuAberto === "usuario"}
                onAlternar={() => alternarMenu("usuario")}
                onFechar={() => setMenuAberto(null)}
                alinhamento="direita"
                rodape={botaoSair}
              />
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full border-2 border-forest/15 px-5 py-2 text-sm font-semibold text-forest-dark transition-colors hover:border-forest/30"
              >
                Entre
              </Link>
              <Link to="/cadastro" className="btn-primary px-5 py-2.5">
                Cadastre-se
                <ArrowIcon className="h-4 w-4" />
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileAberto((valor) => !valor)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-forest/15 text-forest-dark lg:hidden"
          aria-label={mobileAberto ? "Fechar menu" : "Abrir menu"}
          aria-expanded={mobileAberto}
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            {mobileAberto ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {mobileAberto && (
        <div className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-line/70 bg-cream px-6 pb-6 pt-2 lg:hidden">
          <nav aria-label="Principal">
            {grupos.map((grupo) => (
              <details key={grupo.id} className="group border-b border-line/70" open={grupoAtivo(grupo, pathname)}>
                <summary className="flex cursor-pointer list-none items-center justify-between py-3 text-sm font-semibold text-forest-dark [&::-webkit-details-marker]:hidden">
                  {grupo.rotulo}
                  <span className="transition-transform group-open:rotate-180">
                    <Seta aberto={false} />
                  </span>
                </summary>
                <ul className="pb-3">
                  {grupo.itens.map((item) => (
                    <li key={item.para}>
                      <Link
                        to={item.para}
                        onClick={fecharTudo}
                        className="block rounded-lg px-3 py-2 text-sm text-ink-soft hover:bg-cream-dark hover:text-forest-dark"
                      >
                        {item.rotulo}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </nav>

          <div className="mt-4 flex flex-col gap-3">
            {usuario ? (
              <>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">
                  Olá, {primeiroNome}
                </p>
                {ITENS_USUARIO.map((item) => (
                  <Link
                    key={item.para}
                    to={item.para}
                    onClick={fecharTudo}
                    className="text-sm font-medium text-forest-dark hover:underline"
                  >
                    {item.rotulo}
                  </Link>
                ))}
                <button type="button" onClick={handleSair} className="btn-outline mt-2 justify-center">
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={fecharTudo} className="btn-outline justify-center">
                  Entre
                </Link>
                <Link to="/cadastro" onClick={fecharTudo} className="btn-primary justify-center">
                  Cadastre-se
                  <ArrowIcon className="h-4 w-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default HeaderNavegacao;
