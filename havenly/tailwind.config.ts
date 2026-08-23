import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/app/**/*.{ts,tsx}', './src/components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1a365d',
        secondary: '#4a90d9',
        accent: '#e8791e',
        surface: '#f7fafc',
        dark: '#1a202c',
      },
    },
  },
  plugins: [],
}

export default config
