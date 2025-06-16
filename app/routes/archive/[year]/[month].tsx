import { createRoute } from 'honox/factory'
import { getPostsByYearMonth, getAvailableYearMonths } from '../../../utils/posts'
import { PostGrid } from '../../../components/PostGrid'

export default createRoute(async (c) => {
  const year = c.req.param('year')
  const month = c.req.param('month')
  const posts = await getPostsByYearMonth(year, month)
  
  const getMonthName = (month: string) => {
    const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    return monthNames[parseInt(month) - 1];
  };
  
  return c.render(
    <div className="w-full">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {year}年{getMonthName(month)}の投稿
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {year}年{getMonthName(month)}に投稿された記事一覧です。
        </p>
      </header>
      
      {posts.length > 0 ? (
        <PostGrid posts={posts} />
      ) : (
        <div className="text-center py-16">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
            <p className="text-gray-600 mb-4">
              {year}年{getMonthName(month)}の投稿はまだありません。
            </p>
            <div className="space-y-2">
              <a href={`/archive/${year}`} className="block text-blue-600 hover:text-blue-800 transition-colors duration-200">
                {year}年の投稿を見る
              </a>
              <a href="/" className="block text-blue-600 hover:text-blue-800 transition-colors duration-200">
                すべての投稿を見る
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
})

// SSGのための静的パラメータ生成
export const generateStaticParams = async () => {
  const yearMonths = await getAvailableYearMonths()
  return yearMonths.map(({ year, month }) => ({ 
    year: year.toString(), 
    month: month.toString().padStart(2, '0') 
  }))
}