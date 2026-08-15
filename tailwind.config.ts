import type { Config } from 'tailwindcss'
import { THEME } from './lib/theme'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: THEME.core.background,
        ink: THEME.core.ink,
        metal: THEME.core.metal,
        warmgray: THEME.core.warmGray,
        surface: THEME.core.surface,
        accent: THEME.core.accent,
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
export default config
