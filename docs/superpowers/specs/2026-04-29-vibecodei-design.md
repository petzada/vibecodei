# VIBECODEI — Design Spec

**Data:** 2026-04-29
**Status:** Aprovado para implementação

## Visão geral

Site mobile-first estilo "Linkthree" para publicação de artigos curtos sobre programação. Página única lista cards clicáveis; cada card leva à página completa do artigo. Conteúdo é arquivo MDX no próprio repositório, publicação via commit no GitHub (web ou local), build estático no Vercel.

Princípios:
- Simplicidade radical — sem busca, sem filtros, sem expansão de cards, sem comentários, sem dark/light toggle.
- Conteúdo primeiro — paleta monocromática escura, tipografia forte, zero distração.
- Zero JS desnecessário no cliente — renderização inteira em Server Components.
- Publicação rápida — escrever `.mdx`, commitar, esperar ~30-60s do rebuild Vercel, no ar.

## Stack

- Next.js 15 (App Router) + React 19
- TypeScript strict
- Tailwind CSS
- `next-mdx-remote/rsc` + `gray-matter` (parse e render de MDX)
- `rehype-pretty-code` + `shiki` (syntax highlighting build-time, tema `vesper`)
- `reading-time` (cálculo de "X min de leitura")
- Vitest (testes unitários de `lib/articles.ts`)
- Prettier + `prettier-plugin-tailwindcss`, ESLint config Next, lint-staged + husky

Hospedagem: **Railway** (Nixpacks auto-detecta Next.js, builda com `npm run build` e serve com `next start`). Páginas pré-renderizadas no build via `generateStaticParams`; `next start` serve o HTML estático cacheado a partir do servidor Node. Domínio: **vibecodei.com.br** (CNAME apontando para o subdomínio Railway).

## Estrutura do projeto

```
vibecodei/
├── app/
│   ├── layout.tsx              # root: fontes, <html>, metadata default
│   ├── page.tsx                # home (lista cards)
│   ├── not-found.tsx           # 404 estilizado
│   ├── articles/
│   │   └── [slug]/
│   │       └── page.tsx        # rota dinâmica de artigo
│   ├── sitemap.ts
│   ├── robots.ts
│   └── globals.css             # tailwind base + reset
├── components/
│   ├── ArticleCard.tsx         # card da home (server component)
│   └── BackLink.tsx            # "← voltar" da página de artigo
├── content/
│   └── articles/
│       └── *.mdx               # arquivos de artigo
├── lib/
│   ├── articles.ts             # API do conteúdo (única coisa que toca FS)
│   └── mdx-components.tsx      # componentes MDX customizados (h2, code, a, img...)
├── public/
│   └── articles/
│       └── <slug>/             # imagens por artigo
├── tests/
│   └── articles.test.ts        # testes Vitest de lib/articles.ts
├── tailwind.config.ts
├── next.config.mjs
├── tsconfig.json
└── package.json
```

**Princípio de fronteiras:** `lib/articles.ts` é a única peça que toca filesystem. As páginas e componentes só consomem essa API tipada — não conhecem o formato de armazenamento.

## Modelo de dados

### Frontmatter

```yaml
---
title: "Setup mínimo do App Router em 5 min"
description: "Como rodar um Next.js novo do zero sem se perder nas opções"
date: 2026-04-29
published: true        # opcional, default true
---
```

| Campo | Tipo | Obrigatório | Função |
|---|---|---|---|
| `title` | string | sim | card + `<title>` da aba + `<h1>` do artigo |
| `description` | string | sim | card (truncado com `…`) + `<meta description>` |
| `date` | ISO `YYYY-MM-DD` | sim | ordem na home (desc) + meta do artigo |
| `published` | boolean | não (default `true`) | `false` esconde da home; URL ainda funciona |

**Slug:** derivado do nome do arquivo. `setup-nextjs.mdx` → `/articles/setup-nextjs`. Não há campo `slug` no frontmatter — única fonte de verdade é o nome do arquivo.

### API `lib/articles.ts`

```ts
type ArticleMeta = {
  slug: string
  title: string
  description: string
  date: string          // ISO YYYY-MM-DD
  readingTime: number   // minutos, calculado do corpo
  published: boolean
}

getAllArticles(): Promise<ArticleMeta[]>
  // lê content/articles/*.mdx
  // parseia frontmatter via gray-matter
  // calcula readingTime do corpo
  // filtra published=true
  // ordena por date desc

getArticleBySlug(slug: string): Promise<{
  meta: ArticleMeta
  source: string        // string MDX bruta (sem frontmatter)
} | null>
  // retorna null se arquivo não existe
```

Síncrono via `fs.readFileSync` é ok — roda só no servidor durante SSG.

## Páginas e rotas

### `/` — Home (`app/page.tsx`)

Server Component:
1. Chama `getAllArticles()`
2. Renderiza logo "VIBECODEI" (Jersey 25, 36px, centralizado)
3. Mapeia artigos para `<ArticleCard meta={...} />` em loop
4. Se lista vazia: renderiza só o logo (sem mensagem "em breve")

Layout: `<main>` centralizado, `max-width` confortável de leitura mobile (~360-420px), padding lateral.

### `/articles/[slug]` — Página do artigo (`app/articles/[slug]/page.tsx`)

1. `generateStaticParams` lê todos os slugs e pré-renderiza cada um
2. `getArticleBySlug(params.slug)` → `notFound()` se null
3. Renderiza:
   - `<BackLink />` — "← voltar" no topo
   - `<h1>` com `meta.title` em Jersey 25 22px
   - meta line: "29 abr 2026 · 4 min de leitura" (Roboto medium, `text-ink-500`)
   - corpo do artigo: MDX compilado via `compileMDX` de `next-mdx-remote/rsc`, com `mdx-components.tsx` para mapeamento de tags e `rehypePrettyCode` no pipeline rehype
4. `generateMetadata` por artigo: title, description, OG da página

### `/sitemap.xml` (`app/sitemap.ts`)

Gera lista de URLs: home + todos os artigos publicados, com `lastModified` = `date` do frontmatter.

### `/robots.txt` (`app/robots.ts`)

Permite crawl total, aponta pro sitemap.

### `/not-found` (`app/not-found.tsx`)

Página 404 simples no mesmo dark theme: "Artigo não encontrado · ← voltar".

## Componentes

### `<ArticleCard meta={ArticleMeta}>`

Server Component. Renderiza como `<a>` envolvendo um `<article>`:

```tsx
<a href={`/articles/${slug}`} aria-label={`${title} — ${description}`}>
  <article className="flex items-center gap-2 px-3 py-3 mb-2 bg-card border border-border rounded-md font-roboto">
    <span className="font-bold text-[13px] text-ink-200 whitespace-nowrap shrink-0">{title}</span>
    <span className="font-medium text-[12px] text-ink-400 truncate flex-1 min-w-0">{description}</span>
    <span className="text-ink-500 text-[14px] shrink-0">→</span>
  </article>
</a>
```

Comportamento: 1 linha, sem quebra. Descrição trunca com `…`. Toque em qualquer ponto navega.

### `<BackLink />`

Server Component. `<Link href="/">← voltar</Link>` em Roboto medium 12px, cor `text-ink-400`, com margem inferior.

### `mdx-components.tsx`

Mapa de tags MDX → componentes Tailwind:

| Tag | Estilo |
|---|---|
| `h1` | suprimido (renderizado a partir do frontmatter, não do MDX) |
| `h2` | Jersey 25 18px, `text-ink-100`, `mt-6 mb-2` |
| `h3` | Jersey 25 16px, `text-ink-100`, `mt-5 mb-2` |
| `p` | Roboto 12px, `leading-relaxed`, `text-ink-300`, `mb-3` |
| `a` | sublinhado, `text-ink-100` |
| `strong` | Roboto 700, `text-ink-100` |
| `em` | itálico padrão |
| `code` (inline) | monospace, `bg-[#333]`, `px-1 rounded`, 11px |
| `pre`/`code` (bloco) | renderizado por `rehype-pretty-code` (Shiki, tema `vesper`) |
| `img` | `next/image`, largura total, cantos arredondados, `my-4` |
| `ul`/`ol`/`li` | Roboto, marcadores discretos |
| `blockquote` | borda esquerda fina `border-l-2 border-border`, `pl-3`, texto `text-ink-400` |

Imagens em `public/articles/<slug>/*.jpg`, referenciadas com `/articles/<slug>/foto.jpg`.

## Tipografia e paleta

### Cores (Tailwind tokens)

```ts
colors: {
  page: '#2a2a2a',     // fundo da página
  card: '#252525',     // fundo dos cards
  border: '#3a3a3a',   // borda 1px dos cards
  ink: {
    100: '#f5f5f5',    // logo, ênfase, links
    200: '#f0f0f0',    // texto principal
    300: '#d8d8d8',    // corpo do artigo
    400: '#b8b8b8',    // descrição do card
    500: '#888888',    // meta (data, leitura), seta
  },
}
```

### Fontes (via `next/font/google`)

- **Jersey 25** (Google Fonts) — `--font-jersey`. Uso: logo "VIBECODEI" (36px), título do artigo (22px), H2 dentro do artigo (18px), H3 dentro do artigo (16px).
- **Roboto** (pesos 400, 500, 700) — `--font-roboto`. Uso: corpo, cards, descrições, meta, navegação.

### Hierarquia tipográfica

| Elemento | Fonte | Tamanho | Peso | Cor |
|---|---|---|---|---|
| Logo VIBECODEI (home) | Jersey 25 | 36px | regular | `ink-100` |
| Título do artigo (página) | Jersey 25 | 22px | regular | `ink-100` |
| H2 dentro do artigo | Jersey 25 | 18px | regular | `ink-100` |
| H3 dentro do artigo | Jersey 25 | 16px | regular | `ink-100` |
| Card — título | Roboto | 13px | 700 | `ink-200` |
| Card — descrição | Roboto | 12px | 500 | `ink-400` |
| Corpo do artigo | Roboto | 12px | 400 | `ink-300` |
| Meta (data · leitura) | Roboto | 10px | 500 | `ink-500` |
| ← voltar | Roboto | 12px | 500 | `ink-400` |

## Renderização

**Tudo Server Component.** Nenhum hook de estado, nenhum `'use client'`. Resultado: HTML estático, bundle JS quase nulo, primeiro paint imediato, Lighthouse 95+ esperado de saída.

## Estados de erro

- Slug inexistente: `notFound()` → renderiza `app/not-found.tsx`
- MDX com erro de sintaxe: `next build` falha localmente / no CI antes de chegar em produção
- `content/articles/` vazio: home renderiza só o logo
- Frontmatter inválido (campo obrigatório faltando, data malformada): build falha com mensagem clara apontando o arquivo (validação em `getAllArticles`)

## Publicação (workflow)

1. Criar `content/articles/meu-post.mdx` com frontmatter + corpo MDX
2. Commitar e pushar pro GitHub (via Git local, GitHub web UI ou app móvel)
3. Railway detecta push, rebuilda, deploy em ~1-3min (Nixpacks build + `next build`)
4. Artigo aparece na home e a URL `/articles/meu-post` está live

Edição: editar arquivo, commitar, idem. Apagar: `git rm`, idem.

Drafts: `published: false` no frontmatter. Some da home, mas URL acessível diretamente para preview.

## Testes

Vitest cobrindo `lib/articles.ts`:

- `getAllArticles` retorna artigos ordenados por data desc
- `getAllArticles` filtra `published: false`
- `getAllArticles` calcula `readingTime` corretamente
- `getAllArticles` falha com mensagem clara em frontmatter inválido (campo obrigatório faltando)
- `getAllArticles` falha com mensagem clara em data malformada
- `getArticleBySlug` retorna `null` para slug inexistente
- `getArticleBySlug` retorna `meta` + `source` corretos para slug válido
- `getArticleBySlug` separa frontmatter e corpo (source não inclui frontmatter)

Fixtures: `tests/fixtures/articles/*.mdx` com casos válidos e inválidos.

CI: GitHub Action rodando em PR e push: `npm run lint && npm run typecheck && npm run test && npm run build`. Pre-commit (lint-staged + husky): lint + typecheck só nos arquivos staged.

## SEO

- `app/layout.tsx` — `metadata` com title default "VIBECODEI", description, OG image padrão, `metadataBase: new URL('https://vibecodei.com.br')`
- `app/articles/[slug]/page.tsx` — `generateMetadata` por artigo: title = `frontmatter.title`, description = `frontmatter.description`, canonical apontando para `https://vibecodei.com.br/articles/{slug}`
- `sitemap.xml` e `robots.txt` gerados via App Router (URLs absolutos com `vibecodei.com.br`)
- OG image: SVG estático com "VIBECODEI" em Jersey 25, exportado para PNG 1200×630, servido de `public/og.png`

## Acessibilidade

- `<html lang="pt-BR">`
- Contraste verificado: `#f0f0f0` em `#252525` ≈ 14:1 (WCAG AAA)
- Cards são `<a>` envolvendo `<article>`, com `aria-label` descritivo
- Imagens com `alt` obrigatório (lint rule `jsx-a11y/alt-text`)
- `prefers-reduced-motion` respeitado (não há animações no MVP)

## Fora de escopo (deliberadamente)

- Busca, filtros, tags, categorias, paginação
- Comentários, likes, share buttons, related articles
- Newsletter, RSS feed
- Analytics
- Modo claro / dark toggle
- `/admin` custom (publicação via GitHub web supre o caso de uso)
- Configuração de DNS do `vibecodei.com.br` no Railway (passo manual no painel, fora do código)

Reavaliação se: catálogo passar de ~15 artigos (busca/paginação), audiência reclamar (analytics), ou requisitos de marketing surgirem (newsletter, share).
