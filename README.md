# 🍊 Farnel

Plataforma web de doação de alimentos, desenvolvida para as disciplinas de **Front-end Frameworks** (AV1 e AV2) e **Back-end Frameworks** (AV2).

> **Entrega atual: AV2.** O front-end em React passou a usar a API do próprio projeto (**Opção B**): um back-end em
> Spring Boot com banco PostgreSQL, na pasta [`back-end/`](back-end/), neste mesmo repositório. A versão da AV1 está
> marcada com a tag `entrega-av1`.

## Preview do projeto

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
9. [Contrato da API](#contrato-da-api)
10. [Evolução da AV1 para a AV2](#evolução-da-av1-para-a-av2)
11. [Limitações e contingência](#limitações-e-contingência)
12. [Uso de inteligência artificial](#uso-de-inteligência-artificial)
13. [Créditos](#créditos)

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
| **Administrador** | Equipe do Farnel | Acompanha os números do site, modera doações, gerencia contas e verifica instituições |

### Ideia e solução

O sistema facilita a **doação e a distribuição de alimentos**, conectando quem tem alimentos disponíveis para doar com quem precisa deles.

**Exemplo:** um supermercado tem 30 kg de alimentos próximos da data de validade. Em vez de descartá-los, cadastra a doação no Farnel. Uma instituição próxima vê a oferta, solicita a retirada e, depois que o doador aceita, os dois combinam a entrega.

---

## Integrantes e contribuição

> **A confirmar pela equipe:** o nome completo de cada integrante e a descrição das contribuições. As contribuições abaixo foram levantadas a partir do histórico de commits.

| Integrante | GitHub | Principais contribuições |
|---|---|---|
| Emilyano Vasconcelos | [@emilyano-vasconcelos](https://github.com/emilyano-vasconcelos)| Estrutura inicial do projeto React; React Router; dados das doações; página de doações (listagem dinâmica, filtros e ordenação); persistência das doações no `localStorage`; detalhes da doação; layout com rodapé; opção de favoritar doações |
| Mateus Gustavo | [@mtgstv](https://github.com/mtgstv) | Repositório e README; identidade visual e página inicial (componentes, animações, imagens e fontes); página 404; organização das rotas e das páginas; integração entre as branches; reformulação do design e novas páginas. **AV2:** back-end em Spring Boot com PostgreSQL (API, banco, login com JWT e testes), integração do front-end com a API, Meu painel, área administrativa e páginas das instituições |
| Hewerton Phillips | [@hewertonphillips-wq](https://github.com/hewertonphillips-wq) | Cadastro de usuário: formulário, validação de e-mail, bloqueio de e-mail duplicado, gravação no `localStorage`, login automático e mensagens de sucesso |
| Gabriel | [@brtkuma](https://github.com/brtkuma) | Página de favoritos, sua rota e o link no menu |
| Luann Gabriell | — | Página de login e configuração das rotas |

---

## Funcionalidades

Tudo o que aparece no site vem da API e fica gravado no banco de dados: as mudanças valem para todas as pessoas, em qualquer navegador.

### Doações
- **Listagem** de doações com busca por texto, filtros por categoria e status e ordenação (validade mais próxima, mais recentes, nome).
- **Destaques:** carrossel "Estas doações vencem primeiro", atalhos por categoria e fileiras de doações por categoria.
- **Detalhes da doação:** foto, quantidade, validade, conservação, alergênicos, local, forma de retirada e dados do doador. O telefone do doador só aparece para o próprio doador e para quem teve um pedido aceito.
- **Cadastro de doação** em 5 etapas, com prévia ao vivo do anúncio, barra de progresso, envio de foto (clicar ou arrastar), validação ao sair de cada campo e resumo de pendências ao enviar.
- **Favoritos:** ficam na conta, então aparecem em qualquer navegador. Doações vencidas, entregues ou canceladas não podem ser favoritadas.
- **Status calculado:** uma doação fica "Vencida" automaticamente quando passa da validade.

### Solicitações
- **Solicitar uma doação**, com data de retirada limitada à validade do alimento e um pedido em aberto por pessoa em cada doação.
- **Acompanhar pedidos** feitos e recebidos, em abas, com busca, filtro por status e ordenação.
- **Fluxo completo:** quem pediu pode cancelar. O doador aceita ou recusa e depois marca como entregue. Depois do aceite, quem pediu passa a ver o telefone do doador. O status da doação acompanha os pedidos (Disponível → Solicitada → Concluída).

### Conta
- **Cadastro e login pela API**, com mostrar/ocultar senha. A senha fica no banco só como hash BCrypt, e a sessão fica em cookies que o JavaScript da página não consegue ler.
- **Sessão preservada:** ao atualizar a página, a pessoa continua logada; o login expira sozinho e é renovado sem a pessoa perceber. Depois de entrar, ela volta para a página que tentou abrir.
- **Páginas privadas:** nova doação, histórico, solicitações, favoritos, painel e perfil exigem login. A API também recusa (401) quem não está logado.
- **Perfil:** dados pessoais, foto, cidade, telefone, "Você participa como" e troca de senha. Esses dados já preenchem os formulários de doação e de solicitação.
- **Histórico de doações** ("Minhas doações") com contadores por status e as ações de marcar como entregue e cancelar.
- **Meu painel:** números da conta contados pelo banco, como doações por situação e por categoria, quanto já foi entregue, pessoas atendidas e pedidos feitos e recebidos.

### Instituições
- Uma conta vira instituição ao escolher "ONG ou instituição" no perfil. O administrador confere os dados e marca como verificada.
- **Lista pública** das instituições verificadas, com quantas doações cada uma já recebeu.
- **Área da instituição:** situação da verificação, pedidos em andamento, **Doações recebidas** (histórico com filtros) e **Solicitações da instituição**.

### Área administrativa (papel ADMIN)
- **Painel** com os números do site inteiro.
- **Gerenciar doações:** moderação, com o cancelamento de qualquer doação.
- **Gerenciar usuários:** tornar administrador ou voltar a usuário.
- **Gerenciar instituições:** verificar ou tirar a verificação.

### Interface
- Página inicial diferente para visitante e para usuário logado.
- **Estados de requisição** em todas as páginas que buscam dados: carregando, vazio, erro com o botão "Tentar novamente" e mensagens próprias para servidor fora do ar, sessão expirada (401) e falta de permissão (403).
- Mensagens condicionais em toda a aplicação: lista vazia, nenhum resultado com os filtros, erros de validação (inclusive os que vêm da API, mostrados no campo certo) e confirmações ("Doação publicada!", "Pedido enviado!").
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
| `/instituicao` | Área da instituição e lista pública das instituições verificadas | Público |
| `/sobre` | Sobre o projeto, transparência, contato e termos | Público |
| `/login` | Entrar | Público (quem já está logado é redirecionado) |
| `/cadastro` | Criar conta | Público (quem já está logado é redirecionado) |
| `/doacoes/nova` | Cadastrar doação | Logado |
| `/minhas-doacoes` | Histórico das minhas doações | Logado |
| `/solicitacoes` | Pedidos feitos e recebidos (`?aba=feitas` ou `?aba=recebidas`) | Logado |
| `/solicitacoes/nova` | Solicitar uma doação (`?doacao=<id>` já pré-seleciona a doação) | Logado |
| `/favoritos` | Doações favoritadas | Logado |
| `/dashboard` | Meu painel | Logado |
| `/perfil` | Meu perfil | Logado |
| `/instituicao/doacoes` | Doações recebidas pela instituição | Logado (conteúdo para instituições) |
| `/instituicao/solicitacoes` | Solicitações da instituição | Logado (conteúdo para instituições) |
| `/admin` | Painel administrativo | Administrador |
| `/admin/doacoes` | Gerenciar doações | Administrador |
| `/admin/usuarios` | Gerenciar usuários | Administrador |
| `/admin/instituicoes` | Gerenciar instituições | Administrador |
| `/usuarios` | Redireciona para `/admin/usuarios` | Administrador |
| `*` | Página não encontrada (404) | Público |

As rotas protegidas usam `RotaPrivada` e `RotaAdmin` (`front-end/src/routes/`). Elas só escondem as páginas: quem protege os dados de verdade é a API, que responde 401 sem login e 403 sem permissão.

---

## Tecnologias

### Front-end (`front-end/`)

| Tecnologia | Uso |
|---|---|
| [React](https://react.dev/) 19 | Interface com componentes funcionais e hooks (`useState`, `useEffect`, contextos e hooks próprios) |
| JavaScript | Linguagem do projeto (sem TypeScript) |
| [Vite](https://vite.dev/) 8 | Servidor de desenvolvimento e build |
| [React Router](https://reactrouter.com/) 7 | Navegação, rotas privadas e carregamento das páginas sob demanda (`lazy`) |
| [Tailwind CSS](https://tailwindcss.com/) 4 | Estilização utilitária, com cores, fontes e sombras centralizadas em `src/styles/variables.css` |
| CSS tradicional | Animações e componentes visuais em `src/styles/*.css` (carrosséis, chuva de laranjas, hero) |
| `fetch` | Comunicação com a API, concentrada em `src/services/api.js` |
| ESLint | Padronização do código |

### Back-end (`back-end/`)

| Tecnologia | Uso |
|---|---|
| Java 21 e [Spring Boot](https://spring.io/projects/spring-boot) 4.1 | A API REST |
| Spring Security + OAuth2 Resource Server | Login com JWT em cookies HttpOnly e controle de acesso de cada rota |
| Spring Data JPA + Hibernate 7 | Acesso ao banco a partir das classes Java |
| Bean Validation | Validação dos dados recebidos (`@NotBlank`, `@Email`, `@Size`...) |
| [PostgreSQL](https://www.postgresql.org/) 18 | Banco de dados |
| [Flyway](https://flywaydb.org/) | Migrations que criam e alteram as tabelas |
| Docker Compose | Sobe o banco de desenvolvimento com um comando |
| Lombok | Gera getters e construtores |
| JUnit 5, Testcontainers e MockMvc | 47 testes de integração com um PostgreSQL de verdade |
| Maven Wrapper (`mvnw`) | Baixa as dependências, compila, testa e roda |

---

## Como executar

**Pré-requisitos:** [Node.js](https://nodejs.org/) 20.19+ ou 22.12+ (com npm), [JDK 21](https://adoptium.net/) e [Docker Desktop](https://www.docker.com/products/docker-desktop/). Não é preciso instalar o Maven nem o PostgreSQL.

```bash
git clone https://github.com/mtgstv/Farnel.git
cd Farnel
```

**1. Banco e API** (com o Docker Desktop aberto), num terminal:

```bash
cd back-end
docker compose up -d --wait
./mvnw spring-boot:run
```

No PowerShell, o último comando é `.\mvnw.cmd spring-boot:run`. Espere aparecer `Started FarnelApiApplication`. Para conferir se a API e o banco estão no ar, abra <http://localhost:8080/api/v1/status>.

**2. Site**, em outro terminal:

```bash
cd front-end
npm install
npm run dev
```

A aplicação abre em <http://localhost:5173>.

**Variáveis de ambiente:** `front-end/.env.example` traz a `VITE_API_URL` (padrão `http://localhost:8080/api/v1`). Copie para `front-end/.env` só se a API estiver em outro endereço. O `back-end/.env.example` é opcional: serve para usar um PostgreSQL instalado no computador no lugar do Docker.

### Contas de demonstração

O banco de desenvolvimento já vem com doações, pedidos e quatro contas (só existem no banco local). A senha de todas é `exemplos-farnel`.

| Conta | Para que serve |
|---|---|
| `exemplos@farnel.dev` | Doador: dono das 30 doações de exemplo; aceita, recusa e entrega pedidos |
| `pedidos@farnel.dev` | A instituição verificada "Rede Solidária Farnel", com pedidos em aberto e doações recebidas |
| `instituicao@farnel.dev` | A "Cozinha Comunitária Esperança", aguardando verificação |
| `admin@farnel.dev` | Área administrativa |

Também dá para criar uma conta nova em **Entrar → Cadastre-se**.

### Outros comandos

| Comando | Onde | O que faz |
|---|---|---|
| `npm run build` | `front-end/` | Gera a versão de produção em `front-end/dist/` |
| `npm run lint` | `front-end/` | Verifica o código com o ESLint |
| `./mvnw test` | `back-end/` | Roda os 47 testes de integração (precisa do Docker aberto) |
| `docker compose stop` | `back-end/` | Desliga o banco; os dados ficam guardados |
| `docker compose down -v` | `back-end/` | Apaga o banco; na próxima vez a API recria tudo, com os dados de exemplo |

Os erros comuns ao ligar a API e a lista completa de rotas estão no [README do back-end](back-end/README.md).

---

## Estrutura do projeto

```
Farnel/
├── front-end/                     # site em React (Vite)
│   ├── .env.example               # VITE_API_URL
│   ├── public/images/doacoes/     # fotos das doações de exemplo
│   └── src/
│       ├── main.jsx               # ponto de entrada (React + BrowserRouter + provedores)
│       ├── App.jsx                # rotas + tela de erro
│       ├── components/
│       │   ├── Comuns/            # peças reutilizáveis: estados de requisição, ícones, estado vazio, botões, filtros
│       │   ├── Doacoes/           # cartões, foto, selo de status, filtros, janela de detalhes
│       │   ├── Instituicoes/      # aviso das páginas exclusivas de instituições
│       │   ├── Painel/            # números e gráficos do Meu painel e do painel administrativo
│       │   └── ...                # Autenticacao, Decoracao, Formulario, Home, HomeLogado, Layout, NovaDoacao
│       ├── contexts/              # AuthProvider (quem está logado) e FavoritosProvider
│       ├── data/                  # textos da página inicial, opções dos formulários e as doações de exemplo
│       ├── hooks/                 # useCarregar (carregando/erro/tentar de novo), useAuth, useFavoritos...
│       ├── pages/                 # uma pasta por área: Principal, Doacoes, Autenticacao, Instituicoes, Adm
│       ├── routes/                # rotas, layout, RotaPrivada e RotaAdmin
│       ├── services/              # api.js (único ponto de fetch) e um service por assunto
│       └── styles/                # tema (variables.css), componentes visuais e animações
└── back-end/                      # API em Spring Boot (detalhes no README da pasta)
    ├── docker-compose.yml         # banco PostgreSQL de desenvolvimento
    ├── pom.xml
    └── src/
        ├── main/java/br/com/farnel/api/   # um pacote por assunto: auth, usuario, doacao, favorito, solicitacao,
        │                                  # painel, instituicao, admin, status, comum e config
        ├── main/resources/db/migration/   # estrutura do banco (Flyway, V1 a V6)
        └── test/java/br/com/farnel/api/   # testes de integração
```

---

## Dados e persistência

Na AV2, os dados ficam no **banco PostgreSQL** e o site lê e grava tudo pela API. O navegador não guarda dados nem senhas.

| Tabela | O que guarda |
|---|---|
| `usuario` | Contas e perfis (a senha só como hash BCrypt), o papel (USUARIO ou ADMIN) e a verificação das instituições |
| `token_renovacao` | Logins salvos, guardando só o hash do token |
| `usuario_interesse` | Categorias de interesse marcadas no perfil |
| `doacao` e `doacao_alergenico` | Doações e os alergênicos de cada uma |
| `favorito` | Favoritos de cada conta |
| `solicitacao` | Pedidos de doação e seus status |

- **Estrutura:** criada pelas migrations do Flyway (`back-end/src/main/resources/db/migration`, V1 a V6) quando a API liga.
- **Dados de exemplo:** o arquivo `db/exemplo/R__dados_de_exemplo.sql` grava as mesmas 30 doações da AV1, as quatro contas de demonstração e 11 pedidos. Ele só roda no perfil de desenvolvimento, e as validades são contadas a partir do dia em que roda.
- **Sessão:** dois cookies HttpOnly, que o JavaScript não consegue ler: `farnel_acesso` (JWT de 15 minutos) e `farnel_renovacao` (7 dias, usado só para renovar o acesso).
- **`localStorage`:** não guarda mais dados. Ao abrir o site, as chaves antigas da AV1 (`usuarios`, `usuarioLogado`, `doacoes`, `favoritos`, `solicitacoes`...) são apagadas, para não deixar senhas esquecidas no navegador.
- **Arquivos locais que continuam:** `src/data/content.js` (textos da página inicial e as 30 doações de exemplo no formato da interface) e `src/data/opcoesDoacao.js` (opções dos formulários e filtros).
- **Fotos:** são comprimidas no navegador (até 800 px) e enviadas à API como texto (base64), guardadas na própria doação.

---

## Contrato da API

- **URL-base:** `http://localhost:8080/api/v1`. No front-end, ela fica em `VITE_API_URL` e é usada só por `front-end/src/services/api.js`.
- **Formato:** JSON. Datas no formato `aaaa-mm-dd`. As opções vão e voltam com o texto da tela, como `"Grãos"` e `"Disponível"`.
- **Autenticação:** cadastro e login devolvem os cookies HttpOnly `farnel_acesso` (enviado em todas as rotas) e `farnel_renovacao` (enviado só em `/auth`). O front faz todas as requisições com `credentials: "include"` e, ao receber 401, renova a sessão em `/auth/refresh` e repete a requisição uma vez.
- **CORS:** em desenvolvimento, só `http://localhost:5173` pode chamar a API.
- **Erros:** sempre no formato `{ "message": "...", "campos": { "campo": "mensagem" } }`. O `campos` só aparece quando algum campo do formulário está inválido.

| Código | Quando |
|---|---|
| 200 / 201 / 204 | Deu certo / criado / deu certo sem corpo |
| 400 | Dados inválidos (com `campos`) |
| 401 | Sem login, login vencido ou e-mail e senha incorretos |
| 403 | Logado, mas sem permissão (doação de outra pessoa, área administrativa) |
| 404 | Doação, pedido ou conta que não existe |
| 409 | Conflito com o estado atual (e-mail já usado, doação já encerrada, pedido repetido) |
| 429 | Mais de 10 tentativas de login ou cadastro por minuto do mesmo IP |

### Endpoints

Acesso: **público** (sem login), **login** (qualquer conta) e **admin** (papel ADMIN).

| Método | Rota | Acesso | Corpo | Resposta |
|---|---|---|---|---|
| POST | `/auth/cadastro` | público | `{ nome, email, senha }` | 201 + conta e cookies; 409 se o e-mail já existe |
| POST | `/auth/login` | público | `{ email, senha }` | 200 + conta e cookies; 401 |
| POST | `/auth/refresh` | público (cookie de renovação) | — | 200 + conta; 204 sem login salvo; 401 se venceu |
| POST | `/auth/logout` | público | — | 204 e apaga os cookies |
| GET | `/me` | login | — | 200 + conta e perfil (nunca a senha) |
| PUT | `/me` | login | perfil completo (`nome`, `email`, `telefone`, `perfil`, `organizacao`, `sobre`, `cidade`, `uf`, `endereco`, `horario`, `foto`, `interesses`, `avisos`) | 200 + conta; 400; 409 se o e-mail é de outra conta |
| PATCH | `/me/senha` | login | `{ senhaAtual, novaSenha }` | 204; 400 se a senha atual está errada |
| GET | `/doacoes` | público | — | 200 + lista de doações |
| GET | `/doacoes/{id}` | público | — | 200 + doação; 404 |
| GET | `/me/doacoes` | login | — | 200 + doações da conta |
| POST | `/doacoes` | login | doação (exemplo abaixo) | 201 + doação; 400 |
| PATCH | `/doacoes/{id}/status` | login (só o dono) | `{ "status": "Concluída" }` ou `{ "status": "Cancelada" }` | 200 + doação; 403; 409 se já encerrada |
| GET | `/me/favoritos` | login | — | 200 + doações favoritas |
| PUT | `/me/favoritos/{doacaoId}` | login | — | 204; 404; 409 se vencida, entregue ou cancelada |
| DELETE | `/me/favoritos/{doacaoId}` | login | — | 204 |
| POST | `/solicitacoes` | login | pedido (exemplo abaixo) | 201 + pedido; 400; 409 |
| GET | `/me/solicitacoes/feitas` | login | — | 200 + pedidos feitos |
| GET | `/me/solicitacoes/recebidas` | login | — | 200 + pedidos recebidos nas doações da conta |
| PATCH | `/solicitacoes/{id}/status` | login (quem pediu ou o doador) | `{ "status": "Aceita" }` (ou `Recusada`, `Concluída`, `Cancelada`) | 200 + pedido; 403; 409 |
| GET | `/me/painel` | login | — | 200 + números do Meu painel |
| GET | `/instituicoes` | público | — | 200 + instituições verificadas |
| GET | `/status` | público | — | 200 + `{ api, banco, postgres }` |
| GET | `/admin/painel` | admin | — | 200 + números do site inteiro |
| GET | `/admin/doacoes` | admin | — | 200 + todas as doações, com o dono |
| PATCH | `/admin/doacoes/{id}/status` | admin | `{ "status": "Cancelada" }` | 200; 409 se já encerrada |
| GET | `/admin/usuarios` | admin | — | 200 + todas as contas |
| PATCH | `/admin/usuarios/{id}/papel` | admin | `{ "papel": "ADMIN" }` ou `{ "papel": "USUARIO" }` | 200; 409 para o próprio papel |
| GET | `/admin/instituicoes` | admin | — | 200 + todas as instituições |
| PATCH | `/admin/instituicoes/{id}/verificacao` | admin | `{ "verificada": true }` | 204; 404; 409 se a conta não é instituição |

**Quem pode mudar um pedido:** quem pediu só cancela (enquanto pendente ou aceito); o doador aceita ou recusa um pedido pendente e marca como entregue um pedido aceito. A doação acompanha: com pedido em aberto fica `Solicitada`, sem nenhum volta a `Disponível`, e entregue fica `Concluída`.

**Exemplo — cadastrar doação** (`POST /doacoes`):

```json
{
  "titulo": "Arroz Integral em Pacotes", "categoria": "Grãos",
  "descricao": "Pacotes de 5 kg lacrados e dentro da validade.",
  "quantidade": 40, "unidade": "pacotes", "validade": "2027-03-18",
  "conservacao": "Temperatura ambiente", "alergenicos": [],
  "tipoRetirada": "Retirada no local", "cidade": "São Paulo", "uf": "SP",
  "endereco": "Rua da Mooca, 1200", "horario": "Seg. a sáb., das 8h às 18h", "observacoes": null,
  "doador": "Mercado Bom Preço", "contato": "(11) 99999-0000", "imagem": null
}
```

**Exemplo — solicitar doação** (`POST /solicitacoes`):

```json
{
  "doacaoId": 1, "tipoSolicitante": "ONG ou instituição", "nome": "Rede Solidária",
  "contato": "(81) 98888-0000", "quantidade": "10 pacotes", "dataRetirada": "2026-11-25",
  "horario": "Pela manhã", "forma": "Vou retirar no local", "mensagem": null
}
```

**Exemplo — erro de validação** (400):

```json
{ "message": "Confira os campos destacados.", "campos": { "dataRetirada": "A doação vence em 22/11/2026: escolha uma data até lá." } }
```

A resposta completa de cada rota e as regras em detalhe estão no [README do back-end](back-end/README.md).

---

## Evolução da AV1 para a AV2

| Aspecto | Situação na AV1 | Evolução na AV2 | Evidência |
|---|---|---|---|
| **Dados** | JSON local (`src/data/content.js`) e `localStorage` | API própria (Opção B) com banco PostgreSQL e 29 rotas; dados iguais para todas as pessoas | `front-end/src/services/` (`api.js` e um service por assunto); pasta `back-end/` |
| **Autenticação** | Não implementada de verdade: contas e senhas no `localStorage` | Cadastro, login, sessão preservada no F5 (JWT em cookies HttpOnly), logout e rotas protegidas no front e na API (401/403) | `contexts/AuthProvider.jsx`, `routes/RotaPrivada.jsx`, `routes/RotaAdmin.jsx`, `back-end/.../auth/` e `config/SecurityConfig.java`; commit `c1eb04f` |
| **Estados da interface** | Lista e vazio | Carregando, sucesso, vazio e erro, com "Tentar novamente" e mensagens para servidor fora do ar, 401 e 403 | `components/Comuns/EstadoRequisicao.jsx`, `hooks/useCarregar.js` |
| **Organização** | Estrutura inicial: páginas, serviços de `localStorage` e estilos | Front com `services`, `contexts` e `hooks`; back-end separado por assunto, em camadas (Controller → Service → Repository) | Pastas `front-end/src/` e `back-end/src/main/java/br/com/farnel/api/` |
| **Regras de negócio** | Só na tela | Conferidas na API: status do pedido e da doação, telefone liberado após o aceite, um pedido em aberto por pessoa | Classes `*Service.java` do back-end |
| **Páginas "Em breve"** | Meu painel, área administrativa e área da instituição | Todas funcionando, com dados da API | `pages/Doacoes/Dashboard.jsx`, `pages/Adm/`, `pages/Instituicoes/` |
| **Configuração** | — | URL-base em `VITE_API_URL`, com `.env.example` no front e no back-end | `front-end/.env.example`, `back-end/.env.example` |
| **Testes** | Manuais | 47 testes de integração automáticos com PostgreSQL real | `back-end/src/test/java/` |

---

## Limitações e contingência

### Decisões

- **Opção B, no mesmo repositório:** a API fica na pasta `back-end/`, então front e back evoluem juntos e o professor encontra tudo num lugar só.
- **Sessão em cookies HttpOnly**, e não no `localStorage`: um script malicioso não consegue ler o token. O token de acesso dura 15 minutos e é renovado sozinho.
- **Banco no Docker** (porta 5433): sobe igual em qualquer computador com um comando, sem atrapalhar um PostgreSQL já instalado.
- **"Vencida" é calculada**, não gravada: nenhuma doação "esquece" de vencer.
- **Dados de exemplo só no perfil de desenvolvimento:** em produção, o banco começa vazio.

### Limitações conhecidas (AV2)

- **A API não está publicada:** para usar o site, é preciso rodar a API e o banco no computador (Docker e Java).
- **Valores de desenvolvimento no repositório, de propósito:** a senha do banco do Docker, a chave JWT do perfil de desenvolvimento e a senha das contas de demonstração. Eles só funcionam no banco local; em produção (`application.properties`), tudo vem de variáveis de ambiente, sem valor padrão. Nenhuma senha real está versionada.
- **Limite de tentativas na memória:** o contador de logins por IP zera quando a API reinicia.
- **Sem confirmação de e-mail e sem recuperação de senha.**
- **Fotos guardadas no banco como texto (base64):** simples para o projeto, mas pesado com muitas doações.
- **Papel de administrador:** quando muda, vale no próximo token de acesso da pessoa (em até 15 minutos, ou ao entrar de novo).
- **Contraste do botão principal:** o botão laranja com texto branco tem contraste abaixo do recomendado (WCAG). Foi mantido assim pela identidade visual.
- **Componente de classe:** `components/Layout/LimiteDeErro.jsx` é o único componente de classe do projeto. É a forma que o React oferece para capturar erros de renderização e mostrar uma tela amigável em vez da tela em branco.

### Contingência

- **API fora do ar:** as páginas não quebram. Elas mostram "Servidor fora do ar" com o botão "Tentar novamente", e a sessão continua quando a API volta.
- **Sem internet:** API, banco e site rodam no próprio computador, então a demonstração não depende de rede (só as fontes do Google Fonts, que têm fontes de reserva).
- **Dados locais:** as 30 doações de exemplo continuam em `src/data/content.js`, no mesmo formato usado pela interface. Elas são a base dos dados de exemplo do banco.
- **Voltar ao estado inicial:** `docker compose down -v` apaga o banco, e a API recria as tabelas e os dados de exemplo ao ligar.

---

## Uso de inteligência artificial

**AV1:** a equipe usou ferramentas como Claude, ChatGPT, Gemini e Gemma como assistentes de desenvolvimento, e Recraft, Upscale.media e Magnific para a edição dos assets.

**AV2:** o Claude (Claude Code, da Anthropic) foi usado como assistente de programação no back-end e na integração. Ele gerou e explicou o código da API, as migrations, os testes e a integração das páginas com a API; revisou o projeto e testou os fluxos no navegador; e ajudou a escrever a documentação. Todo o código passou pelos 47 testes automáticos e por testes manuais de cada fluxo.

Sugestões da IA e o que foi decidido:

| Sugestão | Decisão |
|---|---|
| Guardar o login em cookies HttpOnly com JWT, em vez do `localStorage` | Aceita |
| Criar o banco de dados pelo pgAdmin | Trocada: o banco passou a rodar no Docker, por decisão da equipe |
| Tirar do menu as páginas que ainda não funcionavam | Recusada: a decisão foi fazer todas funcionarem (Meu painel, área administrativa e área da instituição) |
| Instituição como uma conta com perfil "ONG ou instituição", verificada pelo administrador | Aceita |
| Na revisão final, apontou que marcar a doação inteira como entregue recusava o pedido já aceito | Corrigida, com um teste novo |

---

## Créditos

- Fotos das doações: [Unsplash](https://unsplash.com), sob a [Licença Unsplash](https://unsplash.com/license). Os autores estão listados em `front-end/public/images/doacoes/CREDITOS.md`.
- Dados sobre desperdício de alimentos: ONU, *Food Waste Index Report*, 2024.
