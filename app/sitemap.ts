import type { MetadataRoute } from 'next'
import { getAllArticles } from '../lib/articles'

const BASE_URL = 'https://vibecodei.com.br'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getAllArticles()
  const articleEntries = articles.map((article) => ({
    url: `${BASE_URL}/articles/${article.slug}`,
    lastModified: `${article.date}T00:00:00.000Z`,
  }))

  return [{ url: BASE_URL }, ...articleEntries]
}
