import { Hono } from 'hono'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { createServer } from 'http'

// Import your app
import app from '../app/app'

async function generateStaticSite() {
  const distDir = join(process.cwd(), 'dist')
  
  // Create a test request function
  const generatePage = async (path: string): Promise<string> => {
    const req = new Request(`http://localhost:3000${path}`)
    const res = await app.fetch(req)
    
    if (res.status === 200) {
      return await res.text()
    } else {
      throw new Error(`Failed to generate page ${path}: ${res.status}`)
    }
  }
  
  // Generate pages
  const routes = [
    '/posts/2024-06-learning',
    '/posts/2024-01-daily-life', 
    '/posts/2024-01-blog-start',
    '/tags/技術',
    '/tags/開発',
    '/tags/学習',
    '/tags/TypeScript',
    '/tags/日常',
    '/tags/散歩',
    '/tags/カフェ',
    '/tags/街歩き',
    '/tags/ブログ',
    '/tags/Hono',
    '/archive/2024',
    '/archive/2024/01',
    '/archive/2024/06'
  ]
  
  for (const route of routes) {
    try {
      console.log(`Generating ${route}...`)
      const html = await generatePage(route)
      
      // Create directory if needed
      const filePath = route.endsWith('/') ? `${route}index.html` : `${route}.html`
      const fullPath = join(distDir, filePath)
      const dir = dirname(fullPath)
      
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true })
      }
      
      writeFileSync(fullPath, html)
      console.log(`Generated: ${filePath}`)
    } catch (error) {
      console.error(`Failed to generate ${route}:`, error)
    }
  }
  
  console.log('Static site generation completed!')
}

generateStaticSite().catch(console.error)