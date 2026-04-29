# VIBECODEI — Plano de Implementação

**Data:** 2026-04-29
**Spec base:** `docs/superpowers/specs/2026-04-29-vibecodei-design.md`
**Estratégia:** vertical thin slice — entregar a home renderizando 1 artigo seed antes de polir. A cada fase, validação concreta antes de avançar.

---

## Fase 1 — Scaffold do projeto

**Objetivo:** repositório com Next.js 15 + TS + Tailwind buildando localmente.

**Arquivos a criar:**
- `package.json` — deps: `next@15`, `react@19`, `react-dom@19`, `typescript`, `@types/react`, `@types/node`, `tailwindcss`, `postcss`, `autoprefixer`. Scripts: `dev`, `build`, `start`, `lint`, `typecheck`, `format`.
- `tsconfig.json` — strict mode, paths `@/*` → `./*`, `moduleResolution: bundler`, `jsx: preserve`.
- `next.config.mjs` — config mínima; `images.remotePatterns` vazio (imagens locais), `experimental.mdxRs` desligado (usaremos `next-mdx-remote`).
- `tailwind.config.ts` — content paths, tokens da paleta (`page`, `card`, `border`, `ink.100-500`), fontFamily (`jersey`, `roboto`).
- `postcss.config.mjs` — tailwindcss + autoprefixer.
- `app/globals.css` — `@tailwind base/components/utilities`, CSS reset mínimo, vars de fonte.
- `app/layout.tsx` — `<html lang="pt-BR">`, carregamento de Jersey 25 e Roboto via `next/font/google`, metadata default com `metadataBase: new URL('https://vibecodei.com.br')`.
- `.gitignore` — estender com `node_modules/`, `.next/`, `out/`, `*.tsbuildinfo`, `.env*`, `coverage/`, `.claude/`, `.agents/`, `skills-lock.json`.
- `.eslintrc.json` — extends `next/core-web-vitals`.
- `.prettierrc.json` — config Prettier + plugin Tailwind.
- `README.md` — setup mínimo, como rodar dev, como publicar artigo.

**Validação:**
1. `npm install` sem erro
2. `npm run build` sem erro (página default do Next renderiza)
3. `npm run dev` abre em `http://localhost:3000`
4. `npm run typecheck` limpo
5. `npm run lint` limpo

**Commit:** `chore: scaffold Next.js 15 + TS + Tailwind`

---

## Fase 2 — Camada de conteúdo (`lib/articles.ts` + testes)

**Objetivo:** API de leitura de MDX 100% testada antes de qualquer UI.

**Arquivos a criar:**
- `content/articles/.gitkeep` — diretório existe mesmo vazio.
- `lib/articles.ts` — implementa `getAllArticles()` e `getArticleBySlug(slug)` conforme spec.
  - Deps: `gray-matter`, `reading-time`.
  - Validação interna: campos obrigatórios (`title`, `description`, `date`), data ISO válida, lança erro com nome do arquivo se inválido.
- `vitest.config.ts` — config básica, `test.environment: 'node'`.
- `tests/articles.test.ts` — 8 testes da spec.
- `tests/fixtures/articles/*.mdx` — fixtures: válido publicado, válido draft, frontmatter incompleto, data malformada, datas variadas para teste de ordenação.
- `tests/utils.ts` — helper para apontar `getAllArticles` para `tests/fixtures/articles` em vez de `content/articles` (via parâmetro opcional `dir` ou env var de teste).

**Decisão de design pequena:** `getAllArticles` aceita `dir?: string` (default: `content/articles`). Permite testes apontarem para fixtures sem mock de fs.

**Adições ao `package.json`:** `vitest`, `@vitest/ui`, `gray-matter`, `reading-time`. Script `test` e `test:watch`.

**Validação:**
1. `npm run test` — todos os 8 testes verdes
2. `npm run typecheck` limpo

**Commit:** `feat(lib): articles API + tests`

---

## Fase 3 — Home e card

**Objetivo:** primeira tela funcional renderizando os artigos.

**Arquivos a criar:**
- `components/ArticleCard.tsx` — Server Component, recebe `meta: ArticleMeta`, renderiza link com card 1-linha truncável conforme spec.
- `app/page.tsx` — chama `getAllArticles()`, renderiza logo "VIBECODEI" + lista de cards. Empty state = só logo.
- `content/articles/welcome.mdx` — artigo seed com frontmatter completo + conteúdo curto pra exercitar o pipeline.

**Validação:**
1. `npm run dev` — home mostra "VIBECODEI" + 1 card "welcome"
2. Inspeção visual mobile (DevTools 360px de largura): logo centralizado em Jersey 25, card com layout 1-linha, seta `→` na ponta, tipografia/cores batem com a spec
3. Card é totalmente clicável (cursor pointer no hover)
4. View source: HTML completo, sem `<script>` de hydration desnecessária (Server Component puro)

**Commit:** `feat(home): list articles on landing page`

---

## Fase 4 — Página do artigo

**Objetivo:** clicar no card leva pra página de artigo completa, MDX renderizado.

**Arquivos a criar:**
- `lib/mdx-components.tsx` — mapeamento de tags MDX para componentes Tailwind conforme spec (h1 suprimido, h2/h3 Jersey, p/a/strong/code Roboto, etc.).
- `components/BackLink.tsx` — `<Link href="/">← voltar</Link>`.
- `app/articles/[slug]/page.tsx`:
  - `generateStaticParams` lista todos slugs publicados
  - Função da página chama `getArticleBySlug`, `notFound()` se null
  - Compila MDX com `compileMDX` de `next-mdx-remote/rsc`, passando `components` do `mdx-components.tsx` e `mdxOptions.rehypePlugins: [rehypePrettyCode]`
  - Layout: `<BackLink />`, `<h1>` (Jersey 22px), meta (data + reading time), corpo MDX
  - `generateMetadata` retorna title/description do frontmatter
- `app/not-found.tsx` — página 404 estilizada (logo VIBECODEI menor + "Artigo não encontrado" + ← voltar).

**Adições ao `package.json`:** `next-mdx-remote`, `rehype-pretty-code`, `shiki`.

**Tema Shiki:** `vesper` (dark, baixo contraste — combina com o monocromático).

**Validação:**
1. Click no card "welcome" → navega para `/articles/welcome`
2. Página renderiza com header `← voltar`, título Jersey 22px, meta, corpo
3. Code block no MDX seed sai com syntax highlighting (Shiki vesper)
4. Click em "← voltar" volta pra home
5. URL inexistente (`/articles/foo`) → 404 estilizada
6. View source: HTML completo, conteúdo MDX renderizado server-side

**Commit:** `feat(article): MDX-rendered article page with syntax highlighting`

---

## Fase 5 — SEO, sitemap, og image

**Objetivo:** descobrível e compartilhável.

**Arquivos a criar:**
- `app/sitemap.ts` — gera `/sitemap.xml` com home + URLs de cada artigo publicado, `lastModified` = `meta.date`.
- `app/robots.ts` — `Allow: /`, `Sitemap: https://vibecodei.com.br/sitemap.xml`.
- `app/icon.svg` — favicon simples ("V" em Jersey 25 sobre fundo `#2a2a2a`).
- `public/og.png` — 1200×630 com "VIBECODEI" em Jersey 25 sobre `#2a2a2a`. Gerado via screenshot manual ou rota `app/opengraph-image.tsx` do Next (preferir essa segunda opção: zero passos manuais, regenera no build).
- Atualizar `app/layout.tsx`:
  - `metadata` com `title.template: '%s · VIBECODEI'`, default: `'VIBECODEI'`
  - `description` default
  - `openGraph` default
- Atualizar `app/articles/[slug]/page.tsx` `generateMetadata`:
  - `alternates.canonical: '/articles/' + slug`
  - `openGraph.title`, `openGraph.description`, `openGraph.type: 'article'`, `openGraph.publishedTime: meta.date`
  - `twitter.card: 'summary_large_image'`

**Validação:**
1. `curl http://localhost:3000/sitemap.xml` retorna XML com todas as URLs
2. `curl http://localhost:3000/robots.txt` retorna texto válido
3. `curl http://localhost:3000/articles/welcome` HTML inclui meta tags OG corretas
4. Validador OG (testes manuais com OpenGraph.xyz ou similar) renderiza preview

**Commit:** `feat(seo): sitemap, robots, OG metadata`

---

## Fase 6 — Tooling de qualidade

**Objetivo:** evitar regressões, formatar consistente.

**Arquivos a criar:**
- `.husky/pre-commit` — roda `lint-staged`.
- `lint-staged.config.mjs` — em arquivos staged: `eslint --fix`, `prettier --write`, `tsc --noEmit` (no projeto inteiro).
- `.github/workflows/ci.yml` — em PR e push: `npm ci && npm run lint && npm run typecheck && npm run test && npm run build`.

**Adições ao `package.json`:** `husky`, `lint-staged`, `prettier`, `prettier-plugin-tailwindcss`. Script `prepare: husky`.

**Validação:**
1. Commit propositalmente quebrando lint → pre-commit barra
2. Push de branch nova → action roda no GitHub e passa

**Commit:** `chore: husky pre-commit + GitHub Actions CI`

---

## Fase 7 — Deploy Railway + DNS

**Objetivo:** ambiente público em produção no domínio.

**Passos (manuais no painel Railway, fora do código):**
1. Criar projeto Railway, conectar ao repo GitHub
2. Variável de ambiente: `NODE_ENV=production` (Railway define default)
3. Verificar build: Nixpacks deve detectar Next.js automaticamente. Build command: `npm run build`. Start command: `npm start`. Porta: `3000` (Railway expõe via `$PORT` — Next.js respeita).
4. Conferir healthcheck no `/`
5. Aguardar primeiro deploy ficar verde
6. Adicionar custom domain `vibecodei.com.br` no painel Railway → ele dá um CNAME alvo
7. No registrar do domínio (.com.br): apontar `vibecodei.com.br` (registro A/CNAME conforme orientação Railway, que costuma usar CNAME mas o `.com.br` apex pode exigir ALIAS/ANAME — orientação no painel)
8. Aguardar propagação DNS (~minutos a horas)
9. Confirmar HTTPS automático via Let's Encrypt (Railway gerencia)

**Arquivo de código a criar:**
- `railway.json` (opcional, se precisar override do Nixpacks): defina `deploy.startCommand: "npm start"` explicitamente.

**Validação:**
1. `https://vibecodei.com.br` carrega a home com o artigo "welcome"
2. `https://vibecodei.com.br/articles/welcome` carrega o artigo
3. `https://vibecodei.com.br/sitemap.xml` retorna o sitemap
4. Lighthouse mobile no domínio público: alvo 95+ em Performance, Accessibility, SEO

**Commit (se aplicável):** `chore: railway.json deploy config`

---

## Ordem de execução / dependências

```
Fase 1 (Scaffold)
  └─> Fase 2 (lib + testes)
        └─> Fase 3 (Home)
              └─> Fase 4 (Artigo)
                    └─> Fase 5 (SEO)
                          └─> Fase 6 (CI)
                                └─> Fase 7 (Deploy)
```

Nenhuma fase paralelizável de forma significativa — cada uma depende do que veio antes. Mesmo a Fase 6 (tooling) só faz sentido com código pra rodar, então depois das 1-5.

## Critérios de "pronto" do MVP

- Home com pelo menos 1 artigo carrega em <1s no mobile (3G simulado)
- Artigo carrega em <1.5s
- Lighthouse 95+ em todas as 4 categorias
- Build do CI verde
- Domínio `vibecodei.com.br` resolve com HTTPS
- Publicar novo artigo é só commitar `.mdx` no GitHub (web ou local) e esperar o redeploy

## Estimativa de tempo (ordem de grandeza)

| Fase | Estimativa |
|---|---|
| 1 — Scaffold | 30-45min |
| 2 — Lib + testes | 45-60min |
| 3 — Home | 30min |
| 4 — Artigo | 60-90min (MDX integration costuma ter atrito) |
| 5 — SEO | 30min |
| 6 — CI | 30min |
| 7 — Deploy | 30-60min (depende da propagação DNS, que é fora de mãos) |

**Total ativo:** ~4-6 horas de trabalho em código. Razoável fazer tudo numa sessão ou dividir em 2 (1-3 numa, 4-7 na outra).

## Riscos / coisas que podem dar atrito

- **Versões Next 15 + React 19** — algumas libs (`next-mdx-remote`) podem ter compat issues; tenho fallback de pinar `next@14`/`react@18` se aparecer.
- **Nome do pacote no Railway com `next start`** — geralmente funciona out-of-the-box, mas porta `$PORT` precisa ser respeitada (Next.js já respeita).
- **DNS .com.br no apex** — Railway prefere CNAME, mas registros apex tipicamente exigem ALIAS/ANAME. O Registro.br não suporta isso nativamente. **Mitigação:** usar `www.vibecodei.com.br` como canonical e redirecionar o apex via plataforma do registrar, OU usar o Cloudflare como nameserver (suporta CNAME no apex via flattening). Vou registrar isso na Fase 7 e tomar a decisão na hora.
- **Shiki bundle size** — em build é pesado. Solução: usar `rehype-pretty-code` que faz tree-shake só dos langs usados.
