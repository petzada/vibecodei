import Link from 'next/link'
import type { ArticleMeta } from '../lib/articles'

type ArticleCardProps = {
  meta: ArticleMeta
}

export function ArticleCard({ meta }: ArticleCardProps) {
  return (
    <Link
      href={`/articles/${meta.slug}`}
      aria-label={`${meta.title} - ${meta.description}`}
      className="block"
    >
      <article className="mb-2 flex items-center gap-2 rounded-md border border-border bg-card px-3 py-3 font-roboto">
        <span className="shrink-0 whitespace-nowrap text-[13px] font-bold text-ink-200">
          {meta.title}
        </span>
        <span className="min-w-0 flex-1 truncate text-[12px] font-medium text-ink-400">
          {meta.description}
        </span>
        <span className="shrink-0 text-[14px] text-ink-500" aria-hidden>
          &rarr;
        </span>
      </article>
    </Link>
  )
}
