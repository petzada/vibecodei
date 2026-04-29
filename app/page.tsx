import { ArticleCard } from '../components/ArticleCard'
import { getAllArticles } from '../lib/articles'

export default async function HomePage() {
  const articles = await getAllArticles()

  return (
    <main className="mx-auto flex max-w-md flex-col items-stretch px-4 pb-16 pt-12">
      <h1 className="mb-8 text-center font-jersey text-[36px] leading-none tracking-wide text-ink-100">
        VIBECODEI
      </h1>
      <section aria-label="Lista de artigos">
        {articles.map((article) => (
          <ArticleCard key={article.slug} meta={article} />
        ))}
      </section>
    </main>
  )
}
