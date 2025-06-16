import { createRoute } from 'honox/factory'

export default createRoute((c) => {
  return c.render(
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About</h1>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
        </header>
        
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">このブログについて</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              「My Daily Blog」は、日々の出来事や学んだことを記録するための個人ブログです。
              技術的な発見から日常の小さな出来事まで、様々なことを綴っています。
            </p>
            <p className="text-gray-600 leading-relaxed">
              このブログは<strong>Hono</strong>を使用して構築された静的サイト生成（SSG）ブログで、
              GitHub Pagesでホストされています。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">技術スタック</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">フレームワーク</h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• Hono + HonoX</li>
                  <li>• TypeScript</li>
                  <li>• Vite</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">スタイリング</h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• Tailwind CSS</li>
                  <li>• レスポンシブデザイン</li>
                  <li>• カスタムコンポーネント</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">コンテンツ</h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• MDXファイル</li>
                  <li>• Gray Matter</li>
                  <li>• 年月別ディレクトリ構造</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">デプロイ</h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• GitHub Pages</li>
                  <li>• GitHub Actions</li>
                  <li>• 静的サイト生成</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">投稿カテゴリ</h2>
            <div className="flex flex-wrap gap-2">
              <span className="tag">技術</span>
              <span className="tag">日常</span>
              <span className="tag">学習</span>
              <span className="tag">開発</span>
              <span className="tag">TypeScript</span>
              <span className="tag">ブログ</span>
              <span className="tag">Hono</span>
              <span className="tag">散歩</span>
              <span className="tag">カフェ</span>
              <span className="tag">街歩き</span>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">お問い合わせ</h2>
            <p className="text-gray-600 leading-relaxed">
              このブログに関するご質問やご提案がございましたら、
              <a href="/" className="text-blue-600 hover:text-blue-800 transition-colors duration-200">
                ホームページ
              </a>
              からお気軽にご連絡ください。
            </p>
          </section>
        </div>
      </div>
    </div>
  )
})