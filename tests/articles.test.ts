import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { getAllArticles, getArticleBySlug } from '../lib/articles'

const VALID_FIXTURES_DIR = path.join(process.cwd(), 'tests/fixtures/articles')
const INVALID_MISSING_TITLE_DIR = path.join(process.cwd(), 'tests/fixtures/invalid-missing-title')
const INVALID_DATE_DIR = path.join(process.cwd(), 'tests/fixtures/invalid-date')

describe('getAllArticles', () => {
  it('returns published articles ordered by date descending', async () => {
    const articles = await getAllArticles(VALID_FIXTURES_DIR)
    expect(articles.map((article) => article.slug)).toEqual([
      'setup-recente',
      'typescript-pratico',
      'old-post',
    ])
  })

  it('filters unpublished articles', async () => {
    const articles = await getAllArticles(VALID_FIXTURES_DIR)
    expect(articles.some((article) => article.slug === 'draft-secreto')).toBe(false)
  })

  it('calculates readingTime in minutes', async () => {
    const articles = await getAllArticles(VALID_FIXTURES_DIR)
    const entry = articles.find((article) => article.slug === 'setup-recente')
    expect(entry?.readingTime).toBeGreaterThanOrEqual(1)
  })

  it('throws an error when required frontmatter field is missing', async () => {
    await expect(getAllArticles(INVALID_MISSING_TITLE_DIR)).rejects.toThrow(
      /field "title" is required/i,
    )
  })

  it('throws an error when date is malformed', async () => {
    await expect(getAllArticles(INVALID_DATE_DIR)).rejects.toThrow(
      /field "date" must be ISO YYYY-MM-DD/i,
    )
  })
})

describe('getArticleBySlug', () => {
  it('returns null when slug does not exist', async () => {
    const article = await getArticleBySlug('nao-existe', VALID_FIXTURES_DIR)
    expect(article).toBeNull()
  })

  it('returns metadata and source for an existing slug', async () => {
    const article = await getArticleBySlug('setup-recente', VALID_FIXTURES_DIR)
    expect(article).not.toBeNull()
    expect(article?.meta.slug).toBe('setup-recente')
    expect(article?.meta.title).toMatch(/Setup/)
    expect(article?.source).toContain('Texto curto pro teste.')
  })

  it('returns source without frontmatter block', async () => {
    const article = await getArticleBySlug('setup-recente', VALID_FIXTURES_DIR)
    expect(article?.source).not.toContain('---')
  })
})
