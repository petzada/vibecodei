import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

const DEFAULT_DIR = path.join(process.cwd(), 'content/articles')
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

export type ArticleMeta = {
  slug: string
  title: string
  description: string
  date: string
  readingTime: number
  published: boolean
}

export type ArticleFile = {
  meta: ArticleMeta
  source: string
}

function ensureNonEmptyString(filename: string, field: string, value: unknown): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(
      `Invalid frontmatter in ${filename}: field "${field}" is required and must be a non-empty string.`,
    )
  }
  return value
}

function parseDate(filename: string, value: unknown): string {
  if (value instanceof Date && !isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10)
  }
  if (typeof value === 'string' && ISO_DATE.test(value) && !isNaN(new Date(value).getTime())) {
    return value
  }
  throw new Error(
    `Invalid frontmatter in ${filename}: field "date" must be ISO YYYY-MM-DD (got "${String(value)}").`,
  )
}

function parseFile(filename: string, raw: string): ArticleFile {
  const slug = filename.replace(/\.mdx$/, '')
  const { data, content } = matter(raw)

  const title = ensureNonEmptyString(filename, 'title', data.title)
  const description = ensureNonEmptyString(filename, 'description', data.description)
  const date = parseDate(filename, data.date)
  const published = data.published === undefined ? true : Boolean(data.published)
  const minutes = Math.max(1, Math.ceil(readingTime(content).minutes))

  return {
    meta: { slug, title, description, date, readingTime: minutes, published },
    source: content,
  }
}

export async function getAllArticles(dir: string = DEFAULT_DIR): Promise<ArticleMeta[]> {
  let entries: string[]
  try {
    entries = await fs.readdir(dir)
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return []
    throw err
  }
  const files = entries.filter((f) => f.endsWith('.mdx'))
  const articles: ArticleMeta[] = []
  for (const filename of files) {
    const raw = await fs.readFile(path.join(dir, filename), 'utf8')
    const { meta } = parseFile(filename, raw)
    if (meta.published) articles.push(meta)
  }
  articles.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
  return articles
}

export async function getArticleBySlug(
  slug: string,
  dir: string = DEFAULT_DIR,
): Promise<ArticleFile | null> {
  const filename = `${slug}.mdx`
  const filepath = path.join(dir, filename)
  let raw: string
  try {
    raw = await fs.readFile(filepath, 'utf8')
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return null
    throw err
  }
  return parseFile(filename, raw)
}
