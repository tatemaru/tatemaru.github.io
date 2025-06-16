import { createRoute } from 'honox/factory'
import { getPostsByTag, getAllTags } from '../../utils/posts'
import { PostGrid } from '../../components/PostGrid'

export default createRoute(async (c) => {
  const tag = decodeURIComponent(c.req.param('tag'))
  const posts = await getPostsByTag(tag)
  
  return c.render(
    <div className="w-full">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          「{tag}」の投稿
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          タグ「{tag}」に関連する記事一覧です。
        </p>
      </header>
      
      {posts.length > 0 ? (
        <PostGrid posts={posts} />
      ) : (
        <div className="text-center py-16">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
            <p className="text-gray-600 mb-4">
              「{tag}」タグの投稿はまだありません。
            </p>
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
  const tags = await getAllTags()
  return tags.map(tagItem => ({ tag: encodeURIComponent(tagItem.tag) }))
}