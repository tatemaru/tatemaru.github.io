import type { JSX } from "hono/jsx/jsx-runtime";

interface YearMonthData {
  year: string;
  months: string[];
}

interface DateFilterProps {
  yearMonthData: YearMonthData[];
  selectedYear?: string;
  selectedMonth?: string;
}

export const DateFilter = ({ yearMonthData, selectedYear, selectedMonth }: DateFilterProps): JSX.Element => {
  const getMonthName = (month: string) => {
    const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    return monthNames[parseInt(month) - 1];
  };

  return (
    <div className="relative group">
      <button className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">
        Archive
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="py-2">
          <a href="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200">
            すべての投稿
          </a>
          
          {yearMonthData.map(({ year, months }) => (
            <div key={year} className="relative group/year">
              <div 
                className={`block px-4 py-2 text-sm transition-colors duration-200 flex items-center justify-between cursor-pointer ${
                  selectedYear === year ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <a href={`/archive/${year}`} className="flex-grow">
                  {year}年
                </a>
                {months.length > 0 && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                )}
              </div>
              
              {months.length > 0 && (
                <div className="absolute left-full top-0 w-32 bg-white rounded-md shadow-lg border border-gray-200 ml-1 opacity-0 invisible group-hover/year:opacity-100 group-hover/year:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    {months.map((month) => (
                      <a 
                        key={month}
                        href={`/archive/${year}/${month}`}
                        className={`block px-4 py-2 text-sm transition-colors duration-200 ${
                          selectedMonth === month ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {getMonthName(month)}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};