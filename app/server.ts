import { Hono } from 'hono'
import { readFileSync } from 'fs'
import { join } from 'path'

const app = new Hono()

// Static assets
app.get('/css/*', async (c) => {
  const path = c.req.path.replace('/css/', '')
  try {
    const css = readFileSync(join(process.cwd(), 'public', 'css', path), 'utf-8')
    return c.text(css, 200, { 'Content-Type': 'text/css' })
  } catch {
    return c.notFound()
  }
})

app.get('/images/*', async (c) => {
  const path = c.req.path.replace('/images/', '')
  try {
    const image = readFileSync(join(process.cwd(), 'public', 'images', path))
    const ext = path.split('.').pop()?.toLowerCase()
    const contentType = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' :
                       ext === 'png' ? 'image/png' :
                       ext === 'gif' ? 'image/gif' :
                       ext === 'svg' ? 'image/svg+xml' :
                       ext === 'webp' ? 'image/webp' : 'application/octet-stream'
    return c.body(image, 200, { 'Content-Type': contentType })
  } catch {
    return c.notFound()
  }
})

app.get('/videos/*', async (c) => {
  const path = c.req.path.replace('/videos/', '')
  try {
    const video = readFileSync(join(process.cwd(), 'public', 'videos', path))
    const ext = path.split('.').pop()?.toLowerCase()
    const contentType = ext === 'mp4' ? 'video/mp4' :
                       ext === 'webm' ? 'video/webm' :
                       ext === 'mov' ? 'video/quicktime' : 'application/octet-stream'
    return c.body(video, 200, { 'Content-Type': contentType })
  } catch {
    return c.notFound()
  }
})

export default app