import { readFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'
import matter from 'gray-matter'

export interface Post {
  slug: string
  title: string
  excerpt: string
  tags: string[]
  thumbnail: string
  created_at: string
  updated_at: string
  content: string
  compiledContent?: string
  frontmatter: Record<string, any>
}

function getAllMdxFiles(dir: string): string[] {
  const files: string[] = []
  
  function traverseDirectory(currentDir: string) {
    const items = readdirSync(currentDir)
    
    for (const item of items) {
      const fullPath = join(currentDir, item)
      const stat = statSync(fullPath)
      
      if (stat.isDirectory()) {
        traverseDirectory(fullPath)
      } else if (item.endsWith('.mdx')) {
        files.push(fullPath)
      }
    }
  }
  
  traverseDirectory(dir)
  return files
}

export async function getAllPosts(): Promise<Post[]> {
  const contentDir = join(process.cwd(), 'content')
  
  try {
    const files = getAllMdxFiles(contentDir)
    
    const posts = await Promise.all(files.map(async (filePath) => {
      const content = readFileSync(filePath, 'utf-8')
      const { data, content: markdownContent } = matter(content)
      
      // Generate slug from file path and name
      const relativePath = filePath.replace(contentDir, '').replace(/\.mdx$/, '')
      const slug = relativePath.replace(/^\//, '').replace(/\//g, '-')
      
      // Skip MDX compilation for now to avoid require issues
      const compiledContent = markdownContent
      
      return {
        slug,
        title: data.title || slug,
        excerpt: data.excerpt || markdownContent.substring(0, 150) + '...',
        tags: data.tags || [],
        thumbnail: data.thumbnail || '/images/placeholder.svg',
        created_at: data.created_at || new Date().toISOString().split('T')[0],
        updated_at: data.updated_at || data.created_at || new Date().toISOString().split('T')[0],
        content: markdownContent,
        compiledContent,
        frontmatter: data
      }
    }))
    
    // Sort by created_at date, newest first
    return posts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  } catch (error) {
    console.warn('No posts found or error reading posts directory:', error)
    return []
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const posts = await getAllPosts()
    return posts.find(post => post.slug === slug) || null
  } catch (error) {
    console.error('Error getting post by slug:', error)
    return null
  }
}

export async function getAvailableYears(): Promise<number[]> {
  try {
    const posts = await getAllPosts()
    const years = [...new Set(posts.map(post => parseInt(post.created_at.split('-')[0])))]
    return years.sort((a, b) => b - a) // 新しい年から順番に
  } catch (error) {
    console.error('Error getting available years:', error)
    return []
  }
}

export async function getAvailableMonths(year: string): Promise<string[]> {
  try {
    const posts = await getAllPosts()
    const months = [...new Set(
      posts
        .filter(post => post.created_at.startsWith(year))
        .map(post => post.created_at.split('-')[1])
    )]
    return months.sort((a, b) => b.localeCompare(a)) // 新しい月から順番に
  } catch (error) {
    console.error('Error getting available months:', error)
    return []
  }
}

export async function getPostsByYearMonth(year?: string, month?: string): Promise<Post[]> {
  try {
    const posts = await getAllPosts()
    return posts.filter(post => {
      if (year && !post.created_at.startsWith(year)) return false
      if (month && !post.created_at.startsWith(`${year}-${month}`)) return false
      return true
    })
  } catch (error) {
    console.error('Error getting posts by year/month:', error)
    return []
  }
}

export interface YearMonthData {
  year: string;
  months: string[];
}

export async function getYearMonthData(): Promise<YearMonthData[]> {
  try {
    const posts = await getAllPosts()
    const yearMonthMap = new Map<string, Set<string>>()
    
    posts.forEach(post => {
      const [year, month] = post.created_at.split('-')
      if (!yearMonthMap.has(year)) {
        yearMonthMap.set(year, new Set())
      }
      yearMonthMap.get(year)!.add(month)
    })
    
    return Array.from(yearMonthMap.entries())
      .map(([year, monthsSet]) => ({
        year,
        months: Array.from(monthsSet).sort((a, b) => b.localeCompare(a)) // 新しい月から順番に
      }))
      .sort((a, b) => b.year.localeCompare(a.year)) // 新しい年から順番に
  } catch (error) {
    console.error('Error getting year/month data:', error)
    return []
  }
}

export interface TagWithCount {
  tag: string;
  count: number;
}

export async function getAllTags(): Promise<TagWithCount[]> {
  try {
    const posts = await getAllPosts()
    const tagCounts = new Map<string, number>()
    
    posts.forEach(post => {
      post.tags.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
      })
    })
    
    return Array.from(tagCounts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count) // 投稿数の多い順
  } catch (error) {
    console.error('Error getting all tags:', error)
    return []
  }
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  try {
    const posts = await getAllPosts()
    return posts.filter(post => post.tags.includes(tag))
  } catch (error) {
    console.error('Error getting posts by tag:', error)
    return []
  }
}

export async function getAvailableYearMonths(): Promise<{ year: number; month: number }[]> {
  try {
    const posts = await getAllPosts()
    const yearMonths = new Set<string>()
    
    posts.forEach(post => {
      const [year, month] = post.created_at.split('-')
      yearMonths.add(`${year}-${month}`)
    })
    
    return Array.from(yearMonths)
      .map(ym => {
        const [year, month] = ym.split('-')
        return { year: parseInt(year), month: parseInt(month) }
      })
      .sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year
        return b.month - a.month
      })
  } catch (error) {
    console.error('Error getting available year months:', error)
    return []
  }
}