import { createRoute } from 'honox/factory'
import { getPostBySlug, getAllPosts } from '../../utils/posts'
import { PostLayout } from '../../layouts/PostLayout'

export default createRoute(async (c) => {
  const slug = c.req.param('slug')
  const post = await getPostBySlug(slug)
  
  if (!post) {
    return c.notFound()
  }
  
  // Simple markdown to HTML conversion for now
  const contentHtml = post.content
    .replace(/^# .+$/gm, (match) => `<h1>${match.slice(2)}</h1>`)
    .replace(/^## .+$/gm, (match) => `<h2>${match.slice(3)}</h2>`)
    .replace(/^### .+$/gm, (match) => `<h3>${match.slice(4)}</h3>`)
    .replace(/^- .+$/gm, (match) => `<li>${match.slice(2)}</li>`)
    .replace(/```javascript\n([\s\S]*?)\n```/g, '<pre><code class="language-javascript">$1</code></pre>')
    .replace(/```(\w+)?\n([\s\S]*?)\n```/g, '<pre><code class="language-$1">$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .split('\n\n')
    .map(paragraph => {
      if (paragraph.startsWith('<h') || paragraph.startsWith('<li') || paragraph.startsWith('<pre')) {
        return paragraph
      }
      return paragraph.trim() ? `<p>${paragraph}</p>` : ''
    })
    .filter(Boolean)
    .join('\n')
  
  return c.render(
    <PostLayout post={post}>
      <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </PostLayout>
  )
})

// SSGのための静的パラメータ生成
export const generateStaticParams = async () => {
  const posts = await getAllPosts()
  return posts.map(post => ({ slug: post.slug }))
}