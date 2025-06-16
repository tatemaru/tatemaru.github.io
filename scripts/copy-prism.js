import { copyFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const projectRoot = join(__dirname, '..')
const publicDir = join(projectRoot, 'public')
const prismDir = join(publicDir, 'prism')

// Create prism directory if it doesn't exist
if (!existsSync(prismDir)) {
  mkdirSync(prismDir, { recursive: true })
}

// Source paths
const prismBase = join(projectRoot, 'node_modules', 'prismjs')

// Files to copy
const filesToCopy = [
  // Core CSS and JS
  { src: join(prismBase, 'themes', 'prism-tomorrow.css'), dest: join(prismDir, 'prism-tomorrow.css') },
  { src: join(prismBase, 'prism.js'), dest: join(prismDir, 'prism.js') },
  
  // Language components
  { src: join(prismBase, 'components', 'prism-javascript.js'), dest: join(prismDir, 'prism-javascript.js') },
  { src: join(prismBase, 'components', 'prism-typescript.js'), dest: join(prismDir, 'prism-typescript.js') },
  { src: join(prismBase, 'components', 'prism-jsx.js'), dest: join(prismDir, 'prism-jsx.js') },
  { src: join(prismBase, 'components', 'prism-tsx.js'), dest: join(prismDir, 'prism-tsx.js') },
  { src: join(prismBase, 'components', 'prism-json.js'), dest: join(prismDir, 'prism-json.js') },
  { src: join(prismBase, 'components', 'prism-bash.js'), dest: join(prismDir, 'prism-bash.js') },
  { src: join(prismBase, 'components', 'prism-css.js'), dest: join(prismDir, 'prism-css.js') },
  { src: join(prismBase, 'components', 'prism-markup.js'), dest: join(prismDir, 'prism-markup.js') },
  
  // Plugins
  { src: join(prismBase, 'plugins', 'line-numbers', 'prism-line-numbers.css'), dest: join(prismDir, 'prism-line-numbers.css') },
  { src: join(prismBase, 'plugins', 'line-numbers', 'prism-line-numbers.js'), dest: join(prismDir, 'prism-line-numbers.js') },
]

// Copy files
filesToCopy.forEach(({ src, dest }) => {
  try {
    copyFileSync(src, dest)
    console.log(`Copied: ${src} -> ${dest}`)
  } catch (error) {
    console.warn(`Failed to copy ${src}:`, error.message)
  }
})

console.log('Prism.js files copied successfully!')