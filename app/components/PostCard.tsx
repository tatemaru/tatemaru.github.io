import type { JSX } from "hono/jsx/jsx-runtime";

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  thumbnail: string;
  created_at: string;
  updated_at: string;
  content: string;
  frontmatter: Record<string, any>;
}

interface PostCardProps {
  post: Post;
}

export const PostCard = ({ post }: PostCardProps): JSX.Element => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP');
  };

  return (
    <a href={`/posts/${post.slug}`} className="block hover:shadow-lg transition-shadow duration-200">
      <article className="post-card">
        <div className="aspect-video bg-gray-200 overflow-hidden">
          <img 
            src={post.thumbnail} 
            alt={post.title} 
            className="w-full h-full object-cover" 
            loading="lazy" 
          />
        </div>
        <div className="p-6">
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors duration-200">
            {post.title}
          </h2>
          <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <time dateTime={post.created_at}>
              {formatDate(post.created_at)}
            </time>
            {post.created_at !== post.updated_at && (
              <span>更新: {formatDate(post.updated_at)}</span>
            )}
          </div>
        </div>
      </article>
    </a>
  );
};