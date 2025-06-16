import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./content/**/*.mdx",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', 'sans-serif'],
      },
      aspectRatio: {
        'video': '16 / 9',
      },
    },
  },
  plugins: [
    typography,
  ],
}