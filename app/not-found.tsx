import Link from 'next/link'

export default function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-4 text-center">
      <p className="mb-4 font-jersey text-[28px] leading-none text-ink-100">VIBECODEI</p>
      <h1 className="mb-2 text-[16px] font-bold text-ink-200">Artigo nao encontrado</h1>
      <p className="mb-6 text-[12px] text-ink-400">
        O link pode estar errado ou o artigo nao existe mais.
      </p>
      <Link href="/" className="text-[12px] font-medium text-ink-300 underline underline-offset-2">
        &larr; voltar
      </Link>
    </main>
  )
}
