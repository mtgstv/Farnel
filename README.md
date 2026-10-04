# 🍊 Farnel

Plataforma web de doação de alimentos, desenvolvida para as disciplinas de **Front-end Frameworks** (AV1 e AV2) e **Back-end Frameworks** (AV2).

> **Entrega atual: AV1.** Protótipo funcional em React com dados locais e persistência no `localStorage`, sem API e sem back-end.

![Demonstração do Farnel](front-end/src/assets/previewfarnel.gif)

## Sumário

1. [Problema e público](#problema-e-público)
2. [Integrantes e contribuição](#integrantes-e-contribuição)
3. [Funcionalidades](#funcionalidades)
4. [Rotas da aplicação](#rotas-da-aplicação)
5. [Tecnologias](#tecnologias)
6. [Como executar](#como-executar)
7. [Estrutura do projeto](#estrutura-do-projeto)
8. [Dados e persistência](#dados-e-persistência)
9. [Limitações e contingência](#limitações-e-contingência)
10. [Uso de inteligência artificial](#uso-de-inteligência-artificial)
11. [Evolução planejada para a AV2](#evolução-planejada-para-a-av2)
12. [Créditos](#créditos)

---

## Problema e público

### Tema central

Combate ao desperdício de alimentos por meio da conexão entre doadores e instituições ou beneficiários.

### Problemática

Alimentos em boas condições são descartados aos montes, enquanto instituições e pessoas enfrentam insegurança alimentar.

O desperdício de alimentos é uma problemática reconhecida nos ODS 12 (Consumo e Produção Responsáveis) e 2 (Fome Zero e Agricultura Sustentável). A ONU estima que 1,05 bilhão de toneladas de alimentos foram desperdiçadas em 2022.

Problemas que a aplicação pretende resolver:

- Desperdício de alimentos que ainda estão próprios para consumo.
- Dificuldade de encontrar locais ou pessoas para realizar doações.
- Falta de organização no processo de doação.
- Dificuldade das instituições em encontrar doações disponíveis.
- Falta de acompanhamento sobre o destino das doações.

### Público

| Perfil | Quem é | O que faz no Farnel |
|---|---|---|
| **Doador** | Mercados, restaurantes, padarias, produtores rurais e pessoas físicas | Cadastra alimentos, acompanha o histórico e responde aos pedidos recebidos |
| **Quem recebe** | ONGs, cozinhas solidárias, escolas, creches e pessoas em insegurança alimentar | Encontra doações próximas, favorita e solicita a retirada |

### Ideia e solução

O sistema facilita a **doação e a distribuição de alimentos**, conectando quem tem alimentos disponíveis para doar com quem precisa deles.

**Exemplo:** um supermercado tem 30 kg de alimentos próximos da data de validade. Em vez de descartá-los, cadastra a doação no Farnel. Uma instituição próxima vê a oferta, solicita a retirada e, depois que o doador aceita, os dois combinam a entrega.

---

## Integrantes e contribuição

> **A confirmar pela equipe:** o nome completo de cada integrante e a descrição das contribuições. As contribuições abaixo foram levantadas a partir do histórico de commits.

| Integrante | GitHub | Principais contribuições |
|---|---|---|
| Emilyano Vasconcelos | [@emilyano-vasconcelos](https://github.com/emilyano-vasconcelos)| Estrutura inicial do projeto React; React Router; dados das doações; página de doações (listagem dinâmica, filtros e ordenação); persistência das doações no `localStorage`; detalhes da doação; layout com rodapé; opção de favoritar doações |
| Mateus Gustavo | [@mtgstv](https://github.com/mtgstv) | Repositório e README; identidade visual e página inicial (componentes, animações, imagens e fontes); página 404; organização das rotas e das páginas; integração entre as branches; reformulação do design e novas páginas |
| Hewerton Phillips | [@hewertonphillips-wq](https://github.com/hewertonphillips-wq) | Cadastro de usuário: formulário, validação de e-mail, bloqueio de e-mail duplicado, gravação no `localStorage`, login automático e mensagens de sucesso |
| Maria Dalila | [@brtkuma](https://github.com/brtkuma) | Página de favoritos, sua rota e o link no menu |
| Luann Gabriell | — | Página de login e configuração das rotas |

---

## Funcionalidades

### Doações
- **Listagem** de doações com busca por texto, filtros por categoria e status e ordenação (validade mais próxima, mais recentes, nome).
- **Destaques:** carrossel "Estas doações vencem primeiro", atalhos por categoria e fileiras de doações por categoria.
- **Detalhes da doação:** foto, quantidade, validade, conservação, alergênicos, local, forma de retirada e dados do doador.
- **Cadastro de doação** em 5 etapas, com prévia ao vivo do anúncio, barra de progresso, envio de foto (clicar ou arrastar), validação ao sair de cada campo e resumo de pendências ao enviar.
- **Favoritos:** salvar doações para ver depois. Doações concluídas ou canceladas não podem ser favoritadas.
- **Status calculado:** uma doação fica "Vencida" automaticamente quando passa da validade.

### Solicitações
- **Solicitar uma doação**, com data de retirada limitada à validade do alimento e bloqueio de pedido duplicado.
- **Acompanhar pedidos** feitos e recebidos, em abas, com busca, filtro por status e ordenação.
- **Fluxo completo:** quem pediu pode cancelar. O doador aceita ou recusa e depois marca como entregue. O status da doação acompanha os pedidos (Disponível → Solicitada → Concluída).

### Conta
- **Cadastro e login** locais, com mostrar/ocultar senha. Depois de entrar, a pessoa volta para a página que tentou abrir.
- **Páginas privadas:** nova doação, histórico, solicitações e perfil exigem login.
- **Perfil:** dados pessoais, foto, cidade, telefone e troca de senha. Esses dados já preenchem os formulários de doação e de solicitação.
- **Histórico de doações** ("Minhas doações") com contadores por status e as ações de concluir e cancelar.

### Interface
- Página inicial diferente para visitante e para usuário logado.
- Mensagens condicionais em toda a aplicação: lista vazia, nenhum resultado com os filtros, erros de validação, confirmações ("Doação publicada!", "Pedido enviado!") e aviso quando o armazenamento do navegador está cheio.
- Layout responsivo, do celular (320 px) ao desktop.
- Recursos de acessibilidade: rótulos em todos os campos, navegação por teclado, foco visível e janela de detalhes que fecha com Esc.

---

## Rotas da aplicação

Todas as rotas são acessíveis pelos menus, sem digitar endereços.

| Rota | Página | Acesso |
|---|---|---|
| `/` | Página inicial (versões para visitante e para logado) | Público |
| `/doacoes` | Lista de doações com busca, filtros e ordenação | Público |
| `/detalhes/:id` | Detalhes de uma doação | Público |
| `/favoritos` | Doações favoritadas | Público |
| `/sobre` | Sobre o projeto, transparência, contato e termos | Público |
| `/login` | Entrar | Público (quem já está logado é redirecionado) |
| `/cadastro` | Criar conta | Público (quem já está logado é redirecionado) |
| `/doacoes/nova` | Cadastrar doação | Logado |
| `/minhas-doacoes` | Histórico das minhas doações | Logado |
| `/solicitacoes` | Pedidos feitos e recebidos (`?aba=feitas` ou `?aba=recebidas`) | Logado |
| `/solicitacoes/nova` | Solicitar uma doação (`?doacao=<id>` já pré-seleciona a doação) | Logado |
| `/perfil` | Meu perfil | Logado |
| `/admin`, `/admin/doacoes`, `/admin/instituicoes`, `/admin/usuarios` | Área administrativa | Administrador |
| `/instituicao`, `/instituicao/doacoes`, `/instituicao/solicitacoes`, `/dashboard`, `/usuarios` | Em construção (planejadas) | Público |
| `*` | Página não encontrada (404) | Público |

---

## Tecnologias

| Tecnologia | Uso |
|---|---|
| [React](https://react.dev/) 19 | Interface com componentes funcionais e hooks (`useState`, `useEffect`, `useRef` e hooks próprios) |
| JavaScript | Linguagem do projeto (sem TypeScript) |
| [Vite](https://vite.dev/) 8 | Servidor de desenvolvimento e build |
| [React Router](https://reactrouter.com/) 7 | Navegação, rotas privadas e carregamento das páginas sob demanda (`lazy`) |
| [Tailwind CSS](https://tailwindcss.com/) 4 | Estilização utilitária, com cores, fontes e sombras centralizadas em `src/styles/variables.css` |
| CSS tradicional | Animações e componentes visuais em `src/styles/*.css` (carrosséis, chuva de laranjas, hero) |
| `localStorage` | Persistência dos dados no navegador |
| ESLint | Padronização do código |

---

## Como executar

**Pré-requisitos:** [Node.js](https://nodejs.org/) 20.19+ ou 22.12+ e npm.

O projeto React fica na pasta `front-end/`:

```bash
git clone https://github.com/mtgstv/Farnel.git
cd Farnel/front-end
npm install
npm run dev
```

A aplicação abre em <http://localhost:5173>.

Outros comandos (também dentro de `front-end/`):

| Comando | O que faz |
|---|---|
| `npm run build` | Gera a versão de produção em `front-end/dist/` |
| `npm run preview` | Serve a versão de produção localmente |
| `npm run lint` | Verifica o código com o ESLint |

**Primeiro acesso:** não há contas pré-cadastradas. Para testar as páginas privadas, crie uma conta em **Entrar → Cadastre-se**. Para testar o fluxo de pedidos, use duas contas: uma cadastra a doação e a outra a solicita.

---

## Estrutura do projeto

```
front-end/
├── index.html
├── package.json / package-lock.json
├── vite.config.js
├── public/                  # favicon
└── src/
    ├── main.jsx             # ponto de entrada (React + BrowserRouter)
    ├── App.jsx              # rotas + tela de erro + aviso de armazenamento
    ├── assets/              # imagens (fotos das doações em assets/doacoes)
    ├── components/
    │   ├── Autenticacao/    # formulário de cadastro
    │   ├── Comuns/          # peças reutilizáveis: ícones, estado vazio, botões, filtros
    │   ├── Decoracao/       # elementos decorativos (laranjas flutuantes, chuva de laranjas)
    │   ├── Doacoes/         # cartões, foto, selo de status, filtros, janela de detalhes
    │   ├── Formulario/      # campo com rótulo e erro, campo de senha
    │   ├── Home/            # seções da página inicial do visitante
    │   ├── HomeLogado/      # seções da página inicial de quem está logado
    │   ├── Layout/          # header, rodapé, faixas de topo e moldura das páginas
    │   └── NovaDoacao/      # etapas, prévia, progresso e envio de foto do cadastro de doação
    ├── data/                # dados iniciais (doações de exemplo e opções dos formulários)
    ├── hooks/               # hooks próprios (sessão, carrossel, destino após login)
    ├── pages/               # uma pasta por área: Principal, Doacoes, Autenticacao, Instituicoes, Adm
    ├── routes/              # rotas, layout, rota privada e controle de rolagem
    ├── services/            # leitura e escrita no localStorage e regras de negócio
    └── styles/              # tema (variables.css), componentes visuais e animações
```

---

## Dados e persistência

Não há API nem back-end na AV1. Os dados **iniciais** vêm de arquivos JavaScript locais, e tudo o que o usuário **cria ou altera** é salvo no `localStorage` do navegador.

### Dados iniciais (arquivos locais)

| Arquivo | Conteúdo |
|---|---|
| `src/data/content.js` | **30 doações de exemplo**, que cobrem todas as categorias e status, e os textos da página inicial (estatísticas, passos, parceiros, depoimentos, regiões atendidas) |
| `src/data/opcoesDoacao.js` | Listas dos formulários e filtros: categorias, unidades, conservação, tipos de retirada, alergênicos, estados (UF), status de doações e de solicitações |

### Dados persistidos (`localStorage`)

| Chave | O que guarda | Quando muda |
|---|---|---|
| `doacoes` | Todas as doações (as de exemplo e as cadastradas) | Ao cadastrar, concluir ou cancelar uma doação, ou quando um pedido muda o status dela |
| `doacoesVersaoDados` | Versão dos dados de exemplo | Quando a versão em `services/doacoesStorage.js` aumenta, os dados são recriados do zero |
| `solicitacoes` | Pedidos de doação e seus status | Ao solicitar, aceitar, recusar, cancelar ou marcar como entregue |
| `favoritos` | Doações favoritadas | Ao favoritar ou desfavoritar |
| `usuarios` | Contas cadastradas e dados do perfil | Ao criar conta, editar o perfil ou trocar a senha |
| `usuarioLogado` | Sessão atual (id, nome, e-mail, tipo e foto; **nunca a senha**) | Ao entrar, sair ou editar o perfil |

**Detalhes importantes:**
- **Primeiro acesso:** as doações de exemplo são gravadas no `localStorage` e, a partir daí, o site passa a usar os dados salvos.
- **Doações de demonstração:** as de exemplo não têm uma conta de doador por trás. Elas podem ser vistas e favoritadas, mas não solicitadas, porque ninguém responderia ao pedido.
- **Fotos:** são comprimidas no navegador (até 800 px) antes de serem salvas, para caber no limite do `localStorage`.
- **Dados corrompidos:** se algum dado salvo estiver corrompido, o site volta ao valor padrão em vez de travar.

---

## Limitações e contingência

### Limitações conhecidas (AV1)

- **Sem back-end:** os dados existem só no navegador de cada pessoa. Outro navegador ou outro computador não vê as mesmas doações.
- **Senhas no `localStorage`:** as contas são locais e as senhas ficam sem criptografia. É aceitável num protótipo, mas **não é seguro**. Será substituído pela autenticação da AV2 (nenhuma senha está versionada no repositório).
- **Limite de armazenamento:** o `localStorage` tem cerca de 5 MB. Muitas doações com foto podem enchê-lo; nesse caso, o site avisa que não foi possível salvar.
- **Páginas em construção:** Área da instituição, Dashboard, Usuários e a área administrativa ainda exibem um aviso de "Em construção".
- **Sem conta de administrador:** todo cadastro cria uma conta de doador, e ainda não há como criar um administrador pela interface. Por isso, a área `/admin` fica inacessível (planejada para a AV2).
- **Contraste do botão principal:** o botão laranja com texto branco tem contraste abaixo do recomendado (WCAG). Foi mantido assim pela identidade visual.
- **Componente de classe:** `components/Layout/LimiteDeErro.jsx` é o único componente de classe do projeto. É a forma que o React oferece para capturar erros de renderização e mostrar uma tela amigável em vez da tela em branco; não existe versão em componente funcional.

### Contingência

A AV1 não depende de rede, então funciona igualmente sem internet (exceto as fontes do Google Fonts, que têm fontes de reserva). Na AV2, os dados locais em `src/data/` continuarão disponíveis, com a mesma estrutura usada pela interface, para demonstrar a aplicação caso a API fique indisponível.

---

## Uso de inteligência artificial

A equipe usou ferramentas como: Claude, ChatGPT, Gemini, Gemma, como assistente de desenvolvimento e Recraft, Upscale.media e Magnific para edição de Assets.

---

## Evolução planejada para a AV2

- Substituir os dados locais por uma **API** (Opção B, com o back-end da disciplina de Back-end Frameworks), centralizando as requisições `fetch` em `src/services/`.
- **Autenticação real**, com sessão sem senha no navegador, rotas protegidas e tratamento de respostas 401 e 403.
- Estados visíveis de carregamento, vazio e erro, com a opção de tentar de novo.
- Seções **Contrato da API** e **Evolução da AV1 para a AV2** neste README.

---

## Créditos

- Fotos das doações: [Unsplash](https://unsplash.com), sob a [Licença Unsplash](https://unsplash.com/license). Os autores estão listados em `front-end/src/assets/doacoes/CREDITOS.md`.
- Dados sobre desperdício de alimentos: ONU, *Food Waste Index Report*, 2024.
