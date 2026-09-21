# 🍎 Farnel
Projeto de uma web application com design adaptável destinada às disciplinas de Front-end Frameworks (AV1 e AV2) e Back-end Frameworks (AV2).

## Ideia:
Plataforma de doação de alimentos que conecta doadores (mercados, restaurantes, produtores,
pessoas físicas) a instituições e pessoas em situação de insegurança alimentar, evitando o
descarte de alimentos ainda próprios para consumo.

### Tema e problemática

#### Tema central: 
Combate ao desperdício de alimentos por meio da conexão entre doadores e instituições/beneficiários.

#### Problemática: 
Alimentos em boas condições são descartados aos montes enquanto instituições e pessoas enfrentam insegurança alimentar.

O desperdício de alimentos é inclusive uma problemática reconhecida dentro do ODS 12 — Consumo e Produção Responsáveis e a ODS 2 — Fome Zero e Agricultura Sustentável; a ONU estima que 1,05 bilhão de toneladas de alimentos foram desperdiçadas em 2022.

Problemas que a aplicação pretende resolver:

- Desperdício de alimentos que ainda estão próprios para consumo.
- Dificuldade de encontrar locais/pessoas para realizar doações.
- Falta de organização no processo de doação.
- Dificuldade das instituições em encontrar doações disponíveis.
- Falta de acompanhamento sobre o destino das doações.
---

### Ideia e solução
O sistema busca facilitar a **doação e distribuição de alimentos**, conectando pessoas ou estabelecimentos que possuem alimentos disponíveis para doação com instituições ou pessoas que necessitam desses alimentos.

**Exemplo:**  
Um supermercado possui 30 kg de alimentos próximos da data de validade. Em vez de descartá-los, cadastra a doação no sistema. Uma instituição próxima pode visualizar a oferta e solicitar a retirada.

## Stack

- [React](https://react.dev/) 19 + [Vite](https://vite.dev/)
- [React Router](https://reactrouter.com/) (navegação client-side)
- Dados locais (`src/data/*.json` e `.js`) + `localStorage` (Sem back-end ainda. Planejado para a AV2.)
- [Tailwind CSS v4](https://tailwindcss.com/) — estilização utilitária

## Como rodar

```bash
npm install
npm run dev       # ambiente de desenvolvimento em http://localhost:5173
npm run build     # build de produção em /dist
npm run preview   # servir o build de produção localmente
npm run lint       # checagem de lint (oxlint)
```
