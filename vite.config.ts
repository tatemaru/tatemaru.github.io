import { defineConfig } from 'vite'
import honox from 'honox/vite'
import ssg from '@hono/vite-ssg'

const entry = './app/app.ts'

export default defineConfig(({ mode }) => {
  if (mode === 'client') {
    return {
      build: {
        rollupOptions: {
          input: './app/client.ts',
          output: {
            entryFileNames: 'static/client.js',
          },
        },
      },
    }
  } else {
    return {
      plugins: [
        honox({ entry }),
        ssg({ entry }),
      ],
      server: {
        port: 3000,
      },
      css: {
        postcss: './postcss.config.js',
      },
      publicDir: 'public',
      ssr: {
        external: ['gray-matter', 'fs-extra', '@mdx-js/mdx', 'acorn-jsx', 'recma-jsx'],
      },
      optimizeDeps: {
        include: ['gray-matter'],
      },
    }
  }
})