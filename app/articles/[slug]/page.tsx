import type { Metadata } from 'next'
import { compileMDX } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'
import rehypePrettyCode from 'rehype-pretty-code'
import { BackLink } from '../../../components/BackLink'
import { getAllArticles, getArticleBySlug } from '../../../lib/articles'
import { mdxComponents } from '../../../lib/mdx-components'

type ArticlePageProps = {
  params: Promise<{
    slug: string
  }>
}

function formatDate(dateISO: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${dateISO}T00:00:00Z`))
}

export async function generateStaticParams() {
  const articles = await getAllArticles()
  return articles.map((article) => ({ slug: article.slug }))
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) {
    return {
      title: 'Artigo nao encontrado',
      description: 'O artigo solicitado nao foi encontrado.',
    }
  }

  const canonical = `/articles/${article.meta.slug}`

  return {
    title: article.meta.title,
    description: article.meta.description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: article.meta.title,
      description: article.meta.description,
      type: 'article',
      url: canonical,
      publishedTime: article.meta.date,
      images: [
        {
          url: '/opengraph-image',
          width: 1200,
          height: 630,
          alt: 'VIBECODEI',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.meta.title,
      description: article.meta.description,
      images: ['/opengraph-image'],
    },
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) notFound()

  const { content } = await compileMDX({
    source: article.source,
    components: mdxComponents,
    options: {
      mdxOptions: {
        rehypePlugins: [[rehypePrettyCode, { theme: 'vesper' }]],
      },
    },
  })

  return (
    <main className="mx-auto flex max-w-md flex-col px-4 pb-16 pt-8">
      <BackLink />
      <h1 className="mb-2 font-jersey text-[28px] leading-tight text-ink-100">
        {article.meta.title}
      </h1>
      <p className="mb-6 text-[10px] font-medium text-ink-500">{formatDate(article.meta.date)}</p>
      <article className="rounded-md border border-border bg-card px-4 py-4 font-roboto">
        {content}
      </article>
    </main>
  )
}
