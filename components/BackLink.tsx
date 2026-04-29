import Link from 'next/link'

export function BackLink() {
  return (
    <Link
      href="/"
      className="mb-5 inline-block text-[12px] font-medium text-ink-400 hover:text-ink-200"
    >
      &larr; voltar
    </Link>
  )
}
