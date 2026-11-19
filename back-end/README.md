# Farnel API (back-end)

API REST do Farnel, feita com **Java 21**, **Spring Boot 4**, **PostgreSQL** e **Flyway**. Na AV2, ela substituiu o `localStorage` do front-end.
A arquitetura segue a do back-end do projeto Magnolia: pacotes por funcionalidade, login com JWT em cookie HttpOnly,
migrations do Flyway e testes de integração com Testcontainers.

## Pré-requisitos

- [JDK 21](https://adoptium.net/) (o comando `java -version` deve mostrar 21).
- [Docker Desktop](https://www.docker.com/products/docker-desktop/): o banco de dados roda nele, e os testes também.
- **Não é preciso instalar o Maven nem o PostgreSQL:** o projeto usa o Maven Wrapper (`mvnw`), que baixa a versão certa
  do Maven sozinho, e o banco vem do Docker.

## Como rodar

Com o Docker Desktop aberto, dentro da pasta `back-end/`:

```bash
docker compose up -d --wait
./mvnw spring-boot:run
```

No PowerShell, o segundo comando é `.\mvnw.cmd spring-boot:run`.

1. O primeiro comando liga o banco (PostgreSQL 18 na porta 5433) e espera ele ficar pronto (`Container farnel-db Healthy`).
   Na primeira vez, ele cria o banco `farnel`; depois disso, os dados continuam guardados entre uma vez e outra.
2. O segundo liga a API, já com o perfil **dev** (`application-dev.properties`). As tabelas não precisam ser criadas à mão:
   o Flyway cria tudo ao iniciar. Se rodar pela IDE (botão "Run" no `FarnelApiApplication`), ative o perfil `dev` na
   configuração de execução e, no Windows, adicione a opção de VM `-Djdk.net.unixdomain.tmpdir=C:\Users\Public`
   (o `mvnw` já faz isso sozinho; veja "Erros comuns").

Todas as rotas começam com <http://localhost:8080/api/v1>. Para conferir se a API está conectada ao banco, abra
<http://localhost:8080/api/v1/status>. A resposta esperada é parecida com:

```json
{ "api": "online", "banco": "farnel", "postgres": "18.1" }
```

### Comandos do banco

| Comando (dentro de `back-end/`) | O que faz |
|---|---|
| `docker compose up -d --wait` | liga o banco |
| `docker compose stop` | desliga o banco (os dados ficam guardados) |
| `docker compose down -v` | apaga o banco inteiro; na próxima vez o Flyway recria as tabelas do zero |

### Ver as tabelas no pgAdmin

No pgAdmin, clique com o botão direito em *Servers* → *Register* → *Server...* e preencha:

| Aba | Campo | Valor |
|---|---|---|
| General | Name | `Farnel (Docker)` |
| Connection | Host name/address | `localhost` |
| Connection | Port | `5433` |
| Connection | Maintenance database | `farnel` |
| Connection | Username / Password | `farnel` / `farnel123` |

As tabelas ficam em *Farnel (Docker)* → *Databases* → *farnel* → *Schemas* → *public* → *Tables*.
Essa senha é só do banco de desenvolvimento, que existe apenas no seu computador e só aceita conexões dele.

### Usar o PostgreSQL instalado no computador (opcional)

Se preferir não usar o Docker para o banco: crie o banco `farnel` no seu PostgreSQL, copie `back-end/.env.example` para
`back-end/.env` e troque `DB_SENHA` pela senha do seu usuário `postgres`. Com o `.env` presente, a API usa esse banco
no lugar do Docker. O `.env` fica só no seu computador (não vai para o GitHub).

## Testes

Com o Docker Desktop aberto, dentro de `back-end/`:

```bash
./mvnw test
```

Os testes sobem a API inteira com um PostgreSQL descartável próprio (Testcontainers), então não mexem no banco do
`docker compose`.

## Rotas da API

Todas começam com `/api/v1`. Os erros sempre vêm no formato `{ "message": "...", "campos": { "email": "..." } }`
(`campos` só aparece quando algum campo do formulário está inválido).

| Rota | Login? | O que faz |
|---|---|---|
| `GET /status` | não | API no ar e conectada ao banco |
| `POST /auth/cadastro` | não | cria a conta e já entra (201; 409 se o e-mail já existe; 400 com `campos` se algo estiver inválido) |
| `POST /auth/login` | não | entra (401 se o e-mail ou a senha estiverem errados) |
| `POST /auth/refresh` | não | renova a sessão com o cookie de renovação (200, 204 sem login salvo, 401 se venceu) |
| `POST /auth/logout` | não | encerra a sessão e apaga os cookies |
| `GET /me` | sim | dados da conta e do perfil de quem está logado (401 sem login) |
| `PUT /me` | sim | salva o perfil: nome, e-mail, telefone, "participa como", organização, cidade, UF, endereço, horário, foto, interesses e avisos (400 com `campos`; 409 se o e-mail já for de outra conta) |
| `PATCH /me/senha` | sim | troca a senha: `{ "senhaAtual": "...", "novaSenha": "..." }` (204; 400 com `campos` se a senha atual estiver errada) |
| `GET /doacoes` | não | todas as doações (o telefone do doador, `contato`, só vem para o próprio doador e para quem teve um pedido aceito nela) |
| `GET /doacoes/{id}` | não | uma doação (404 se não existir) |
| `POST /doacoes` | sim | cadastra uma doação da pessoa logada (201; 400 com `campos` se algo estiver inválido) |
| `PATCH /doacoes/{id}/status` | sim | encerra a doação: `{ "status": "Concluída" }` (entregue) ou `{ "status": "Cancelada" }` (403 se não for o dono; 409 se já estiver encerrada) |
| `GET /me/doacoes` | sim | as doações da pessoa logada (página "Minhas doações") |
| `GET /me/favoritos` | sim | as doações favoritas da pessoa logada, das mais recentes para as mais antigas |
| `PUT /me/favoritos/{id}` | sim | favorita uma doação (204; repetir não duplica; 409 se ela estiver vencida, entregue ou cancelada; 404 se não existir) |
| `DELETE /me/favoritos/{id}` | sim | tira a doação dos favoritos (204) |
| `POST /solicitacoes` | sim | pede uma doação (201; 400 com `campos` se for a própria doação ou a retirada passar da validade; 409 se ela não estiver mais disponível ou se já houver um pedido seu em aberto) |
| `GET /me/solicitacoes/feitas` | sim | pedidos que a pessoa fez (o telefone do doador, `doacao.contato`, só vem depois do aceite) |
| `GET /me/solicitacoes/recebidas` | sim | pedidos recebidos nas doações da pessoa, com o telefone de quem pediu |
| `GET /me/painel` | sim | números do "Meu painel", contados pelo banco: doações por situação e por categoria, quanto já foi entregue (por unidade), pessoas atendidas, pedidos feitos e recebidos por status e favoritos |
| `PATCH /solicitacoes/{id}/status` | sim | quem pediu: `"Cancelada"`; o doador: `"Aceita"`, `"Recusada"` ou `"Concluída"` (entregue). 403 para outra pessoa; 409 se o pedido não puder mais ir para esse status |
| `GET /instituicoes` | não | as instituições **verificadas** (contas "ONG ou instituição"), em ordem alfabética, com quantas doações cada uma já recebeu |
| `GET /admin/painel` | admin | números do site inteiro: contas, administradores, instituições, doadores, doações e pedidos por situação, quanto já foi entregue e pessoas atendidas |
| `GET /admin/doacoes` | admin | todas as doações, cada uma com quem a cadastrou (`dono`) |
| `PATCH /admin/doacoes/{id}/status` | admin | moderação: `{ "status": "Cancelada" }` cancela a doação e os pedidos em aberto dela (409 se já estiver encerrada) |
| `GET /admin/usuarios` | admin | todas as contas, com quantas doações e pedidos cada uma tem |
| `PATCH /admin/usuarios/{id}/papel` | admin | `{ "papel": "ADMIN" }` ou `{ "papel": "USUARIO" }` (409 para o próprio papel); vale a partir do próximo token de acesso da pessoa |
| `GET /admin/instituicoes` | admin | todas as instituições, as que aguardam verificação primeiro, com e-mail e situação (`verificada`) |
| `PATCH /admin/instituicoes/{id}/verificacao` | admin | `{ "verificada": true }` ou `{ "verificada": false }` (204; 404 se a conta não existir; 409 se ela não participar como "ONG ou instituição") |

Rotas marcadas como **admin** exigem uma conta com papel `ADMIN`: sem login, 401; com uma conta comum, 403.

**Instituições:** uma conta vira instituição quando escolhe "ONG ou instituição" no perfil (`PUT /me`). Ela começa como
não verificada; só depois que um administrador a verifica é que ela aparece em `GET /instituicoes`. Se a conta deixar de
ser instituição, perde a verificação. As "doações recebidas" de uma instituição são os pedidos dela marcados como entregues.

**Status da doação e dos pedidos:** com um pedido em aberto (pendente ou aceito), a doação fica `Solicitada`; se o pedido
for cancelado ou recusado, ela volta a `Disponível`. Marcar o pedido como entregue conclui a doação e recusa os outros
pedidos dela. Se o doador marcar a doação inteira como entregue (em "Minhas doações"), o pedido que ele já tinha
aceitado conta como entregue e os pendentes são recusados. Se o doador cancelar a doação, os pedidos em aberto são
cancelados junto.

As opções das doações (categoria, conservação, tipo de retirada, status e alergênicos) vão e voltam no JSON com o texto
da tela, como `"Grãos"` e `"Temperatura ambiente"`; no banco ficam os códigos (`GRAOS`, `TEMPERATURA_AMBIENTE`).
As datas usam o formato `aaaa-mm-dd`. Exemplo de uma doação (`GET /doacoes/1`, sem login):

```json
{
  "id": 1, "titulo": "Arroz Integral em Pacotes", "categoria": "Grãos",
  "descricao": "Pacotes de 5 kg de arroz integral, lacrados e dentro da validade. Sobra de estoque de fim de mês.",
  "quantidade": 40.00, "unidade": "pacotes", "validade": "2027-03-18", "conservacao": "Temperatura ambiente",
  "alergenicos": [], "cidade": "São Paulo", "uf": "SP", "endereco": "Rua da Mooca, 1200 - Mooca",
  "tipoRetirada": "Retirada no local", "horario": "Seg. a sáb., das 8h às 18h",
  "observacoes": "Retirada pela doca de carga, nos fundos do mercado.", "doador": "Mercado Bom Preço",
  "contato": null, "imagem": "/images/doacoes/arroz-integral.jpg", "status": "Disponível",
  "criadoEm": "2026-11-15T22:08:25.905885Z", "usuarioId": 1
}
```

## Dados de exemplo (só no perfil dev)

O arquivo `db/exemplo/R__dados_de_exemplo.sql` coloca no banco as mesmas 30 doações de exemplo do front-end, com
validades contadas a partir do dia em que ele roda. As fotos delas ficam no front (`front-end/public/images/doacoes/`).
Ele roda depois das migrations e de novo sempre que o arquivo for alterado. Em produção, ele não entra.

Ele também cria quatro **contas de demonstração**, que só existem no banco local (senha `exemplos-farnel` em todas):

| Conta | Para que serve |
|---|---|
| `exemplos@farnel.dev` | dona das doações de exemplo: entrando com ela, dá para aceitar pedidos e encerrar essas doações |
| `pedidos@farnel.dev` | a instituição **verificada** "Rede Solidária Farnel": fez os pedidos das 6 doações "Solicitada" e recebeu as 5 "Concluída" (abre a Área da instituição com histórico) |
| `instituicao@farnel.dev` | a instituição "Cozinha Comunitária Esperança", **aguardando verificação**: serve para mostrar o administrador verificando uma instituição |
| `admin@farnel.dev` | administradora: abre a área administrativa (`/admin`) |

**Como funciona o login:** cadastro e login devolvem dois cookies HttpOnly (que o JavaScript da página não consegue ler):
`farnel_acesso`, um JWT de 15 minutos enviado em toda requisição, e `farnel_renovacao`, que dura 7 dias e só serve para pedir
um novo token de acesso em `/auth/refresh`. O front-end precisa chamar a API com `credentials: "include"`.
Login e cadastro aceitam no máximo 10 tentativas por minuto do mesmo IP (depois disso, 429).

## Erros comuns ao iniciar

| Mensagem | O que fazer |
|---|---|
| `failed to connect to the docker API` ou `dockerDesktopLinuxEngine` | O Docker Desktop não está aberto. Abra e espere ele ligar. |
| `Connection to localhost:5433 refused` | O banco não está ligado: rode `docker compose up -d --wait`. |
| `port is already allocated` (porta 5433) | Outro programa ou container já usa a porta 5433 (ex.: o banco do Magnolia). Pare-o com `docker compose stop` na pasta dele. |
| `Port 8080 was already in use` | Já existe outra API rodando: feche-a antes de iniciar de novo. |
| `Unable to establish loopback connection` | Problema do Java no Windows com a pasta temporária do usuário. O `mvnw` já evita isso (perfil `windows` do `pom.xml`); pela IDE, adicione a opção de VM `-Djdk.net.unixdomain.tmpdir=C:\Users\Public`. |
| `Could not resolve placeholder 'DB_URL'` | A API foi iniciada sem o perfil `dev` (ex.: pela IDE). Ative o perfil `dev`. |
| `autenticação do tipo senha falhou` | Só acontece usando o `.env` (PostgreSQL instalado): a senha está errada. |
| `o banco de dados "farnel" não existe` | Só acontece usando o `.env`: falta criar o banco `farnel` no pgAdmin. |

## Estrutura

```
back-end/
├── pom.xml                       # dependências (o "package.json" do Java)
├── mvnw, mvnw.cmd, .mvn/         # Maven Wrapper
├── docker-compose.yml            # banco de desenvolvimento (PostgreSQL 18 na porta 5433)
├── .env.example                  # opcional: modelo para usar o PostgreSQL instalado no lugar do Docker
└── src/
    ├── main/java/br/com/farnel/api/
    │   ├── FarnelApiApplication.java   # ponto de entrada
    │   ├── auth/      cadastro, login, renovação da sessão, logout e limite de tentativas
    │   ├── usuario/   conta e perfil do usuário (rotas /me e /me/senha)
    │   ├── doacao/    doações: listar, ver, cadastrar, encerrar e "minhas doações"
    │   ├── favorito/  favoritos de cada conta
    │   ├── solicitacao/  pedidos de doação: pedir, aceitar, recusar, cancelar e entregar
    │   ├── painel/    números do "Meu painel" (consultas SQL com COUNT, SUM e GROUP BY)
    │   ├── instituicao/  lista pública das instituições verificadas e a verificação feita pelo admin
    │   ├── admin/     área administrativa: painel do site, moderação de doações, papéis das contas e instituições
    │   ├── status/    verificação da API e do banco
    │   ├── comum/     formato e tratamento dos erros da API
    │   └── config/    segurança, CORS e JWT
    ├── main/resources/
    │   ├── application.properties       # produção (valores vêm de variáveis de ambiente)
    │   ├── application-dev.properties   # perfil dev (seu computador)
    │   ├── db/migration/                # estrutura do banco (Flyway): V1, V2...
    │   └── db/exemplo/                  # doações de exemplo (só no perfil dev)
    └── test/java/br/com/farnel/api/      # testes de integração (Testcontainers)
```

Cada funcionalidade nova ganha o seu pacote, com as mesmas peças: entidade (tabela), repository (consultas),
service (regras), controller (rotas) e DTOs (formato do JSON). Cada mudança no banco vira uma migration nova
(`V2__...sql`); uma migration que já rodou nunca é editada.

## Produção

Sem o perfil dev, a API exige estas variáveis de ambiente e não inicia se faltar alguma:

| Variável | Exemplo |
|---|---|
| `DB_URL`, `DB_USUARIO`, `DB_SENHA` | `jdbc:postgresql://servidor:5432/farnel` |
| `APP_AUTH_SEGREDO_JWT` | texto aleatório com 32+ caracteres |
| `APP_CORS_ORIGENS` | `https://www.seusite.com.br` |
