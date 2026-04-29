import path from 'node:path'

const buildNextLintCommand = (files) => {
  const scoped = files
    .filter((file) => /\.(js|jsx|ts|tsx)$/.test(file))
    .map((file) => path.relative(process.cwd(), file))

  if (scoped.length === 0) return 'echo "No JS/TS files to lint"'
  return `next lint --fix --file ${scoped.join(' --file ')}`
}

export default {
  '*.{js,mjs,cjs,jsx,ts,tsx}': [buildNextLintCommand, 'prettier --write'],
  '*.{json,md,mdx,css,yml,yaml}': ['prettier --write'],
}
