import type { JSX } from "hono/jsx/jsx-runtime";

interface FooterProps {
  year?: number;
  siteName?: string;
}

export const Footer = ({ 
  year = new Date().getFullYear(), 
  siteName = "My Daily Blog" 
}: FooterProps): JSX.Element => {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-6 py-8 text-center">
        <p>&copy; {year} {siteName}. All rights reserved.</p>
      </div>
    </footer>
  );
};