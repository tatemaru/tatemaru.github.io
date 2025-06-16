import { createRoute } from 'honox/factory'
import { getAllPosts, getAvailableYears } from '../utils/posts'
import { PostGrid } from '../components/PostGrid'

export default createRoute(async (c) => {
  const posts = await getAllPosts()
  const years = await getAvailableYears()
  
  return c.render(
    <div className="w-full">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">最近の記事</h1>
      </header>
      
      <PostGrid posts={posts} />
    </div>
  )
})