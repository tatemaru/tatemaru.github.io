import type { JSX } from "hono/jsx/jsx-runtime";
import { Tag } from '../components/Tag';
import type { Post } from '../components/PostCard';

interface PostLayoutProps {
  post: Post;
  children: JSX.Element | JSX.Element[];
}

export const PostLayout = ({ post, children }: PostLayoutProps): JSX.Element => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <article className="bg-white rounded-lg shadow-md overflow-hidden">
        <header className="p-8 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <time dateTime={post.created_at}>
              作成: {formatDate(post.created_at)}
            </time>
            <time dateTime={post.updated_at}>
              更新: {formatDate(post.updated_at)}
            </time>
          </div>
          <div className="mt-4">
            {post.tags.map((tag, index) => (
              <Tag key={index}>{tag}</Tag>
            ))}
          </div>
        </header>
        
        <div className="post-content p-8 prose prose-lg max-w-none">
          {children}
        </div>
        
        <footer className="p-8 border-t border-gray-200">
          <nav>
            <a href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              ホームに戻る
            </a>
          </nav>
        </footer>
      </article>
    </div>
  );
};