import type { JSX } from "hono/jsx/jsx-runtime";

interface TagModalProps {
  isOpen: boolean;
  onClose: () => void;
  tags: Array<{ tag: string; count: number }>;
}

export const TagModal = ({ isOpen, onClose, tags }: TagModalProps): JSX.Element => {

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" style={{ display: 'none' }}>
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        ></div>
        
        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">タグ一覧</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <div className="p-6 overflow-y-auto max-h-64">
            {tags.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {tags.map(({ tag, count }) => (
                  <a
                    key={tag}
                    href={`/tags/${encodeURIComponent(tag)}`}
                    className="tag-item flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 group"
                  >
                    <span className="font-medium">{tag}</span>
                    <span className="text-sm text-gray-500 group-hover:text-blue-500">
                      {count}
                    </span>
                  </a>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">タグが見つかりませんでした。</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};