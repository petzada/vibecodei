import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        page: '#2a2a2a',
        card: '#252525',
        border: '#3a3a3a',
        ink: {
          100: '#f5f5f5',
          200: '#f0f0f0',
          300: '#d8d8d8',
          400: '#b8b8b8',
          500: '#888888',
        },
      },
      fontFamily: {
        jersey: ['var(--font-jersey)', 'serif'],
        roboto: ['var(--font-roboto)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
