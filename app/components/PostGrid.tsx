import type { JSX } from "hono/jsx/jsx-runtime";
import { PostCard, type Post } from './PostCard';

interface PostGridProps {
  posts: Post[];
}

export const PostGrid = ({ posts }: PostGridProps): JSX.Element => {
  if (posts.length === 0) {
    return (
      <div className="no-posts text-center py-16">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
          <p className="text-gray-600 mb-4">まだ投稿がありません。最初の記事を書いてみましょう！</p>
          <p className="text-sm text-gray-500">content/ ディレクトリに .mdx ファイルを作成してください。</p>
        </div>
      </div>
    );
  }

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </section>
  );
};