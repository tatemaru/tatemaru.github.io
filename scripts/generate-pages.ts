import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'
import { getAllPosts, getAllTags, getAvailableYears, getAvailableYearMonths, getPostsByTag, getYearMonthData } from '../app/utils/posts'
import { fetchMultipleOGPData, generateOGPCard } from '../src/utils/ogp'

// Helper function to generate HTML layout
function generateLayout(title: string, content: string): string {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="Web系テック記事とアウトドア関連を中心に、日々の出来事を綴るブログ">
    <link rel="stylesheet" href="/css/style.css">
    <link href="/prism/prism-tomorrow.css" rel="stylesheet">
    <link href="/prism/prism-line-numbers.css" rel="stylesheet">
</head>
<body class="bg-gray-50 min-h-screen flex flex-col">
    ${content}
    <script src="/prism/prism.js"></script>
    <script src="/prism/prism-javascript.js"></script>
    <script src="/prism/prism-typescript.js"></script>
    <script src="/prism/prism-jsx.js"></script>
    <script src="/prism/prism-tsx.js"></script>
    <script src="/prism/prism-json.js"></script>
    <script src="/prism/prism-bash.js"></script>
    <script src="/prism/prism-css.js"></script>
    <script src="/prism/prism-markup.js"></script>
    <script src="/prism/prism-line-numbers.js"></script>
</body>
</html>`
}

// Helper function to generate header
async function generateHeader(): Promise<string> {
  const yearMonthData = await getYearMonthData()
  const tags = await getAllTags()
  
  return `<header class="bg-white shadow-sm border-b border-gray-200">
    <nav class="max-w-7xl mx-auto px-6 py-4">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900">
          <a href="/" class="hover:text-blue-600 transition-colors duration-200">たてまる blog</a>
        </h1>
        <ul class="flex items-center space-x-8">
          <li><a href="/" class="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">Home</a></li>
          <li><a href="/about" class="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">About</a></li>
          <li><button id="tags-button" class="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">Tags</button></li>
          <li>
            <div class="relative group">
              <button class="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">
                Archive
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <div class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div class="py-2">
                  <a href="/" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200">すべての投稿</a>
                  ${yearMonthData.map(yearData => `
                    <div class="relative group/year">
                      <div class="block px-4 py-2 text-sm transition-colors duration-200 flex items-center justify-between cursor-pointer text-gray-700 hover:bg-gray-100">
                        <a href="/archive/${yearData.year}" class="flex-grow">${yearData.year}年</a>
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                      </div>
                      <div class="absolute left-full top-0 w-32 bg-white rounded-md shadow-lg border border-gray-200 ml-1 opacity-0 invisible group-hover/year:opacity-100 group-hover/year:visible transition-all duration-200 z-50">
                        <div class="py-2">
                          ${yearData.months.map(month => `
                            <a href="/archive/${yearData.year}/${month.padStart(2, '0')}" class="block px-4 py-2 text-sm transition-colors duration-200 text-gray-700 hover:bg-gray-100">${parseInt(month)}月</a>
                          `).join('')}
                        </div>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  </header>`
}

// Helper function to generate footer
function generateFooter(): string {
  return `<footer class="bg-gray-900 text-white mt-16">
    <div class="max-w-7xl mx-auto px-6 py-8 text-center">
      <p>© 2025 My Daily Blog. All rights reserved.</p>
    </div>
  </footer>`
}

// Helper function to convert markdown to HTML with OGP support
async function markdownToHtml(content: string): Promise<string> {
  // Split content into blocks first, preserving code blocks
  const blocks: string[] = []
  let current = ''
  let inCodeBlock = false
  
  const lines = content.split('\n')
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        // End of code block
        current += line + '\n'
        blocks.push(current.trim())
        current = ''
        inCodeBlock = false
      } else {
        // Start of code block
        if (current.trim()) {
          blocks.push(current.trim())
          current = ''
        }
        current += line + '\n'
        inCodeBlock = true
      }
    } else if (inCodeBlock) {
      current += line + '\n'
    } else if (line.trim() === '') {
      if (current.trim()) {
        blocks.push(current.trim())
        current = ''
      }
    } else {
      current += line + '\n'
    }
  }
  
  if (current.trim()) {
    blocks.push(current.trim())
  }
  
  // Extract URLs for OGP processing
  const urlPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  const urls: string[] = [];
  let match;
  
  while ((match = urlPattern.exec(content)) !== null) {
    const url = match[2];
    // Only process HTTP/HTTPS URLs and exclude images
    if ((url.startsWith('http://') || url.startsWith('https://')) && !content.includes(`![${match[1]}](${url})`)) {
      urls.push(url);
    }
  }
  
  // Fetch OGP data for all URLs
  const ogpDataMap = urls.length > 0 ? await fetchMultipleOGPData(urls) : new Map();
  
  // Process each block
  const processedBlocks = blocks.map(block => {
    const trimmed = block.trim()
    
    // Handle code blocks
    if (trimmed.startsWith('```')) {
      const match = trimmed.match(/```(\w+)?\n([\s\S]*?)\n```/)
      if (match) {
        const language = match[1] || 'text'
        const code = match[2]
        return `<pre class="line-numbers"><code class="language-${language}">${escapeHtml(code)}</code></pre>`
      }
      return trimmed
    }
    
    // Process regular markdown
    let html = trimmed
    
    // Handle headers
    html = html.replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold text-gray-900 mb-6 mt-8 first:mt-0">$1</h1>')
    html = html.replace(/^## (.+)$/gm, '<h2 class="text-2xl font-semibold text-gray-800 mb-4 mt-8">$1</h2>')
    html = html.replace(/^### (.+)$/gm, '<h3 class="text-xl font-semibold text-gray-800 mb-3 mt-6">$1</h3>')
    
    // Handle lists
    html = html.replace(/^- (.+)$/gm, '<li class="mb-2">$1</li>')
    
    // Handle bold and italic
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold">$1</strong>')
    html = html.replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>')
    
    // Handle inline code
    html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">$1</code>')
    
    // Handle images first (to avoid conflict with links)
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="w-full h-auto rounded-lg shadow-md my-6">')
    
    // Handle links with OGP support (after images to avoid conflicts)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
      // Check if this URL has OGP data and is HTTP/HTTPS
      if ((url.startsWith('http://') || url.startsWith('https://')) && ogpDataMap.has(url)) {
        const ogpData = ogpDataMap.get(url);
        if (ogpData && (ogpData.title || ogpData.description || ogpData.image)) {
          return generateOGPCard(ogpData);
        }
      }
      // Fallback to regular link
      return `<a href="${url}" class="text-blue-600 hover:text-blue-800 transition-colors duration-200 underline">${text}</a>`;
    })
    
    // Wrap content appropriately
    if (html.startsWith('<h') || html.startsWith('<img') || html.startsWith('<div class="ogp-card')) {
      return html
    } else if (html.includes('<li')) {
      return `<ul class="list-disc list-inside space-y-2 mb-4 ml-4">${html}</ul>`
    } else {
      return `<p class="text-gray-700 leading-relaxed mb-4">${html}</p>`
    }
  })
  
  return processedBlocks.join('\n')
}

// Helper function to escape HTML
function escapeHtml(text: string): string {
  const div = { innerHTML: '' } as any
  div.textContent = text
  return div.innerHTML || text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

async function generateStaticPages() {
  const distDir = join(process.cwd(), 'dist')
  const header = await generateHeader()
  const footer = generateFooter()
  
  // Generate post pages
  const posts = await getAllPosts()
  for (const post of posts) {
    const postsDir = join(distDir, 'posts')
    mkdirSync(postsDir, { recursive: true })
    
    const contentHtml = await markdownToHtml(post.content)
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('ja-JP')
    
    const mainContent = `
    ${header}
    <main class="flex-grow max-w-4xl mx-auto px-6 py-8 w-full">
      <article class="bg-white rounded-lg shadow-sm p-8">
        <header class="mb-8">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">${post.title}</h1>
          <div class="flex flex-wrap gap-2 mb-4">
            ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>
          <div class="flex items-center justify-between text-sm text-gray-500 border-b border-gray-200 pb-4">
            <time datetime="${post.created_at}">作成日: ${formatDate(post.created_at)}</time>
            ${post.created_at !== post.updated_at ? `<span>更新日: ${formatDate(post.updated_at)}</span>` : ''}
          </div>
        </header>
        <div class="prose prose-lg max-w-none">
          ${contentHtml}
        </div>
        <footer class="mt-8 pt-8 border-t border-gray-200">
          <a href="/" class="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            記事一覧に戻る
          </a>
        </footer>
      </article>
    </main>
    ${footer}
    <script>
      document.addEventListener('DOMContentLoaded', function() {
        const tagsButton = document.getElementById('tags-button');
        if (tagsButton) {
          tagsButton.addEventListener('click', function() {
            window.location.href = '/';
          });
        }
      });
    </script>`
    
    const html = generateLayout(`${post.title} - たてまる blog`, mainContent)
    writeFileSync(join(postsDir, `${post.slug}.html`), html)
    console.log(`Generated: posts/${post.slug}.html`)
  }
  
  // Generate tag pages
  const tags = await getAllTags()
  for (const tag of tags) {
    const tagsDir = join(distDir, 'tags')
    mkdirSync(tagsDir, { recursive: true })
    
    const encodedTag = encodeURIComponent(tag.tag)
    const tagPosts = await getPostsByTag(tag.tag)
    
    const mainContent = `
    ${header}
    <main class="flex-grow max-w-7xl mx-auto px-6 py-8 w-full">
      <div class="w-full">
        <header class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">「${tag.tag}」の投稿</h1>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            タグ「${tag.tag}」に関連する記事一覧です。（${tag.count}件）
          </p>
        </header>
        
        ${tagPosts.length > 0 ? `
          <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${tagPosts.map(post => `
              <a href="/posts/${post.slug}" class="block hover:shadow-lg transition-shadow duration-200">
                <article class="post-card">
                  <div class="aspect-video bg-gray-200 overflow-hidden">
                    <img src="${post.thumbnail}" alt="${post.title}" class="w-full h-full object-cover" loading="lazy">
                  </div>
                  <div class="p-6">
                    <div class="flex flex-wrap gap-2 mb-3">
                      ${post.tags.map(tagName => `<span class="tag">${tagName}</span>`).join('')}
                    </div>
                    <h2 class="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors duration-200">
                      ${post.title}
                    </h2>
                    <p class="text-gray-600 text-sm mb-4">${post.excerpt}</p>
                    <div class="flex items-center justify-between text-xs text-gray-500">
                      <time datetime="${post.created_at}">${new Date(post.created_at).toLocaleDateString('ja-JP')}</time>
                    </div>
                  </div>
                </article>
              </a>
            `).join('')}
          </section>
        ` : `
          <div class="text-center py-16">
            <div class="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
              <p class="text-gray-600 mb-4">「${tag.tag}」タグの投稿はまだありません。</p>
              <a href="/" class="text-blue-600 hover:text-blue-800 transition-colors duration-200">
                すべての投稿を見る
              </a>
            </div>
          </div>
        `}
      </div>
    </main>
    ${footer}`
    
    const html = generateLayout(`「${tag.tag}」の投稿 - たてまる blog`, mainContent)
    writeFileSync(join(tagsDir, `${encodedTag}.html`), html)
    console.log(`Generated: tags/${encodedTag}.html`)
  }
  
  console.log('Static page generation completed!')
}

generateStaticPages().catch(console.error)