import { jsxRenderer } from 'hono/jsx-renderer'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { TagModal } from '../components/TagModal'
import { getYearMonthData, getAllTags } from '../utils/posts'
import { siteName, siteDescription } from '../constants/const'

export default jsxRenderer(async ({ children, title, description }) => {
    const pageTitle = title ? `${title} | ${siteName}` : `${siteName}`
    const pageDescription = description ?? siteDescription
    
    const yearMonthData = await getYearMonthData()
    const tags = await getAllTags()

  return (
    <html lang="ja">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="stylesheet" href="/css/style.css" />
      </head>
      <body className="bg-gray-50 min-h-screen flex flex-col">
        <Header yearMonthData={yearMonthData} tags={tags} />
        <main className="flex-grow max-w-7xl mx-auto px-6 py-8 w-full">
          {children}
        </main>
        <Footer />
        
        {/* Tag Modal */}
        <TagModal isOpen={false} onClose={() => {}} tags={tags} />
        
        <script dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('DOMContentLoaded', function() {
              const tagsButton = document.getElementById('tags-button');
              const modal = document.querySelector('.fixed.inset-0.z-50');
              const backdrop = modal?.querySelector('.fixed.inset-0.bg-black');
              const closeButton = modal?.querySelector('button');
              
              function showModal() {
                if (modal) {
                  modal.style.display = 'block';
                  document.body.style.overflow = 'hidden';
                }
              }
              
              function hideModal() {
                if (modal) {
                  modal.style.display = 'none';
                  document.body.style.overflow = 'auto';
                }
              }
              
              tagsButton?.addEventListener('click', showModal);
              backdrop?.addEventListener('click', hideModal);
              closeButton?.addEventListener('click', hideModal);
              
              // ESCキーでモーダルを閉じる
              document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && modal?.style.display === 'block') {
                  hideModal();
                }
              });
            });
          `
        }} />
      </body>
    </html>
  )
})