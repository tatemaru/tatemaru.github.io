import { createRoute } from 'honox/factory'
import { getPostsByYearMonth, getAvailableMonths, getAvailableYears } from '../../utils/posts'
import { PostGrid } from '../../components/PostGrid'

export default createRoute(async (c) => {
  const year = c.req.param('year')
  const posts = await getPostsByYearMonth(year)
  const availableMonths = await getAvailableMonths(year)
  
  return c.render(
    <div className="w-full">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{year}年の投稿</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {year}年に投稿された記事一覧です。
        </p>
      </header>
      
      {posts.length > 0 ? (
        <PostGrid posts={posts} />
      ) : (
        <div className="text-center py-16">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
            <p className="text-gray-600 mb-4">{year}年の投稿はまだありません。</p>
            <a href="/" className="text-blue-600 hover:text-blue-800 transition-colors duration-200">
              すべての投稿を見る
            </a>
          </div>
        </div>
      )}
    </div>
  )
})

// SSGのための静的パラメータ生成
export const generateStaticParams = async () => {
  const years = await getAvailableYears()
  return years.map(year => ({ year: year.toString() }))
}