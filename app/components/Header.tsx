import type { JSX } from "hono/jsx/jsx-runtime";
import { DateFilter } from './DateFilter';
import { TagButton } from './TagButton';
import { TagModal } from './TagModal';
import { siteName } from '../constants/const'
import type { YearMonthData, TagWithCount } from '../utils/posts';

interface HeaderProps {
  title?: string;
  yearMonthData?: YearMonthData[];
  tags?: TagWithCount[];
  selectedYear?: string;
  selectedMonth?: string;
}

export const Header = ({ 
  title = siteName || 'My Daily Blog', 
  yearMonthData = [], 
  tags = [],
  selectedYear, 
  selectedMonth
}: HeaderProps): JSX.Element => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            <a href="/" className="hover:text-blue-600 transition-colors duration-200">
              {title}
            </a>
          </h1>
          <ul className="flex items-center space-x-8">
            <li>
              <a href="/" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">
                Home
              </a>
            </li>
            <li>
              <a href="/about" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">
                About
              </a>
            </li>
            <li>
              <button 
                id="tags-button"
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium"
              >
                Tags
              </button>
            </li>
            {yearMonthData.length > 0 && (
              <li>
                <DateFilter 
                  yearMonthData={yearMonthData} 
                  selectedYear={selectedYear}
                  selectedMonth={selectedMonth}
                />
              </li>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
};