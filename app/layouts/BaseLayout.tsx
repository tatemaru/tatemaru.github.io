import type { JSX } from "hono/jsx/jsx-runtime";
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

interface BaseLayoutProps {
  children: JSX.Element | JSX.Element[];
  title?: string;
  description?: string;
}

export const BaseLayout = ({ 
  children, 
  title = "My Daily Blog",
  description = "日々の出来事を綴るブログ"
}: BaseLayoutProps): JSX.Element => {
  return (
    <html lang="ja">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <link rel="stylesheet" href="/css/style.css" />
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
      </head>
      <body className="bg-gray-50 min-h-screen">
        <Header />
        <main className="max-w-7xl mx-auto px-6 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
};