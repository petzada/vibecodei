# VIBECODEI

![Status](https://img.shields.io/badge/status-pausado-lightgrey) ![Licença](https://img.shields.io/badge/licen%C3%A7a-MIT-green) ![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js) ![MDX](https://img.shields.io/badge/MDX-1B1F24?logo=mdx)

Site **mobile-first** no estilo "link na bio" para publicar **artigos curtos sobre programação** escritos em MDX, sem banco de dados nem painel.

## Status do projeto

⏸️ **Pausado**: a primeira versão foi publicada em abril de 2026 e não recebeu novos commits desde então.

## Demonstração

- **Home** em formato de lista de cards, como uma página de links, com título, descrição e tempo de leitura de cada artigo.
- **Página do artigo** com Markdown/MDX e destaque de código (Shiki).
- Imagem **Open Graph** gerada automaticamente, `sitemap` e `robots`.
- Publicar é só criar um arquivo `.mdx`.

## Tecnologias utilizadas

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS**
- **MDX** com `next-mdx-remote`, `gray-matter`, `rehype-pretty-code` e **Shiki**
- **Vitest**, ESLint, Prettier, Husky + lint-staged
- **Railway** (hospedagem)

## Pré-requisitos e instalação

**Pré-requisitos**

- **Node.js 22.13** ou superior e **npm 10.8** ou superior

**Instalação**

```bash
git clone https://github.com/petzada/vibecodei.git
cd vibecodei
npm install
```

## Como utilizar

```bash
npm run dev       # http://localhost:3000
```

**Publicar um artigo**: crie `content/articles/<slug>.mdx`:

```mdx
---
title: "Título do artigo"
description: "Mini descrição que aparece no card da home"
date: 2026-04-29
---

Conteúdo em **Markdown** com suporte a MDX.
```

O artigo aparece na home e em `/articles/<slug>`.

## Testes

```bash
npm test              # vitest run
npm run lint
npm run typecheck
```

Os testes validam a leitura e ordenação dos artigos a partir das fixtures em `tests/fixtures/`.

## Contribuição

Contribuições são bem-vindas! Para propor uma melhoria:

1. Abra uma **issue** descrevendo o problema ou a ideia antes de começar algo grande.
2. Faça um **fork** e crie um branch a partir da `main`: `<tipo>/<nome-kebab>` (`feat`, `fix`, `docs`, `refactor`, `test`, `chore`).
3. Use **commits semânticos** em português: `<tipo>(<escopo>): <descrição no imperativo>`.
4. Rode lint e testes antes de enviar (veja [Testes](#testes)).
5. Abra o **Pull Request** em *draft*, explicando o quê e o porquê. O merge é feito pelo autor.

Não inclua segredos (`.env`, chaves de API, tokens) em commits ou PRs.

## Licença

Distribuído sob a licença **MIT**, de código aberto. Isso significa que você **pode** usar, copiar, modificar, mesclar, publicar, distribuir, sublicenciar e até vender cópias do código, inclusive em projetos comerciais, **desde que** mantenha o aviso de copyright e o texto da licença. O software é fornecido "no estado em que se encontra", **sem garantias**, e o autor não se responsabiliza por danos decorrentes do uso.

Texto completo em [`LICENSE`](LICENSE).

## Autor e contato

**Marcio Petigrosso** ("petzada"): idealização e desenvolvimento.

- GitHub: [@petzada](https://github.com/petzada)
- LinkedIn: [in/petigrosso](https://www.linkedin.com/in/petigrosso)
