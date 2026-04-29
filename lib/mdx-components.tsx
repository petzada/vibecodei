import Image from 'next/image'
import type { MDXComponents } from 'mdx/types'

function MdxImage(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const src = typeof props.src === 'string' ? props.src : ''
  if (!src) return null

  const width = typeof props.width === 'number' ? props.width : Number(props.width) || 1200
  const height = typeof props.height === 'number' ? props.height : Number(props.height) || 800

  return (
    <Image
      src={src}
      alt={props.alt ?? ''}
      width={width}
      height={height}
      className="my-4 h-auto w-full rounded-md border border-border"
    />
  )
}

export const mdxComponents: MDXComponents = {
  h1: () => null,
  h2: (props) => (
    <h2 className="mb-2 mt-6 font-jersey text-[22px] leading-tight text-ink-100" {...props} />
  ),
  h3: (props) => (
    <h3 className="mb-2 mt-5 font-jersey text-[19px] leading-tight text-ink-100" {...props} />
  ),
  p: (props) => <p className="mb-3 text-[14px] leading-relaxed text-ink-300" {...props} />,
  a: (props) => (
    <a className="text-ink-100 underline decoration-border underline-offset-2" {...props} />
  ),
  strong: (props) => <strong className="font-bold text-ink-100" {...props} />,
  code: ({ className, ...props }) => {
    if (className) {
      return <code className={className} {...props} />
    }

    return <code className="rounded bg-[#333] px-1 py-0.5 text-[12px]" {...props} />
  },
  pre: (props) => (
    <pre
      className="my-4 overflow-x-auto rounded-md border border-border bg-[#1a1a1a] p-3 text-[12px] [&_code]:bg-transparent [&_code]:p-0"
      {...props}
    />
  ),
  ul: (props) => <ul className="mb-3 list-disc pl-5 text-[14px] text-ink-300" {...props} />,
  ol: (props) => <ol className="mb-3 list-decimal pl-5 text-[14px] text-ink-300" {...props} />,
  li: (props) => <li className="mb-1" {...props} />,
  blockquote: (props) => (
    <blockquote className="mb-3 border-l-2 border-border pl-3 text-ink-400" {...props} />
  ),
  img: MdxImage,
}
