# VIBECODEI

Site mobile-first estilo Linkthree para artigos curtos sobre programação.

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS · MDX (`next-mdx-remote/rsc`).

## Desenvolvimento

```bash
npm install
npm run dev
```

Abre em http://localhost:3000.

## Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de dev local |
| `npm run build` | Build de produção |
| `npm run start` | Serve o build local |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript |
| `npm run format` | Prettier |

## Publicar um artigo

1. Criar `content/articles/<slug>.mdx`:

   ```mdx
   ---
   title: "Título do artigo"
   description: "Mini descrição que aparece no card da home"
   date: 2026-04-29
   ---

   Conteúdo em **Markdown** com suporte a MDX.
   ```

2. Commitar e pushar pro GitHub (CLI, GitHub web ou app móvel).
3. Railway rebuilda em ~1-3min e o artigo entra no ar em `vibecodei.com.br/articles/<slug>`.

Drafts: `published: false` no frontmatter esconde da home (URL ainda funciona).
