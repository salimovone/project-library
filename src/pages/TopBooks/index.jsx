import React, { useEffect, useState } from 'react';
import { fetchTopBooksPaginated } from '../../services/bookService';
import { NewArrivalCard } from '../../components';
import { BiGridAlt, BiListUl } from 'react-icons/bi';
import { Link } from 'react-router';

// Helper component for List Row View
const BookRowItem = ({ book }) => {
  const imageUrl = book.img;
  
  const icons = [];
  if (book.is_physical) {
    icons.push(
      <svg key="phys" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-[#1a56db]">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    );
  }
  if (book.has_audio) {
    icons.push(
      <svg key="audio" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-[#e02424]">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
      </svg>
    );
  }
  if (book.has_pdf) {
    icons.push(
      <svg key="pdf" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-[#ff7b42]">
        <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
        <line x1="12" x2="12.01" y1="18" y2="18" />
      </svg>
    );
  }

  return (
    <Link to={`/books/${book.id}`} className="group flex flex-col md:flex-row md:items-center justify-between p-4 bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300 border border-gray-100/80 hover:-translate-y-0.5">
      <div className="flex flex-1 items-center gap-5">
        <div className="w-[72px] h-[96px] flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 relative shadow-sm">
          <img src={imageUrl} alt={book.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
        <div className="flex flex-col">
          <h3 className="text-[17px] font-bold text-gray-800 line-clamp-1 mb-1.5 group-hover:text-[#1a478e] transition-colors">{book.name}</h3>
          <div className="flex flex-wrap gap-1 mb-3">
            {book.author && book.author.map((author, idx) => (
              <span key={idx} className="text-[13.5px] text-gray-500 font-medium">
                {author?.name}{idx < book.author.length - 1 ? ", " : ""}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-1.5 bg-[#FFFBEB] px-2.5 py-1 rounded-lg border border-[#FEF3C7] w-max">
            <span className="text-[13px] font-black text-[#B45309]">
              {book.rating?.toFixed(1) || "0.0"}
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#F59E0B]"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.218 21.416c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" /></svg>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 mt-4 md:mt-0 justify-end md:justify-start pt-4 border-t border-gray-100 md:pt-0 md:border-0 pl-1">
        {icons.map((icon, idx) => (
          <div key={idx} className="p-2.5 bg-gray-50 rounded-full border border-gray-100 shadow-sm group-hover:bg-white group-hover:border-gray-200 transition-colors">
            {icon}
          </div>
        ))}
      </div>
    </Link>
  );
};

export default function TopBooks() {
  const [viewMode, setViewMode] = useState('grid');
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const limit = 26;

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    fetchTopBooksPaginated(page, limit).then((response) => {
      if (isMounted) {
        setBooks(response.results || []);
        setTotalCount(response.count || response.results?.length || 0);
        setIsLoading(false);
      }
    }).catch(err => {
      console.error(err);
      if (isMounted) setIsLoading(false);
    });
    return () => { isMounted = false; };
  }, [page]);

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans pb-16">
      <div className="bg-[#f2f4f7] py-3 shadow-sm mb-8">
        <div className="custom-container mx-auto px-4 text-sm font-medium text-[#143c7b]">
          <Link to="/" className="hover:underline">Home</Link> / Top Kitoblar
        </div>
      </div>

      <div className="custom-container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-200/60">
          <h1 className="text-2xl font-extrabold text-[#1e293b] flex items-center gap-3">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#F59E0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            Top Kitoblar
          </h1>
          
          <div className="flex items-center bg-gray-50 rounded-xl shadow-inner border border-gray-200/80 p-1.5">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2.5 rounded-lg transition-all duration-200 flex items-center gap-2 ${viewMode === 'grid' ? 'bg-white text-[#1a478e] shadow-sm font-semibold' : 'text-gray-500 hover:text-[#1a478e] hover:bg-white/50'}`}
              title="Grid View"
            >
              <BiGridAlt className="text-xl" />
              <span className="text-sm hidden sm:block">Setka</span>
            </button>
            <button 
              onClick={() => setViewMode('row')}
              className={`p-2.5 rounded-lg transition-all duration-200 flex items-center gap-2 ${viewMode === 'row' ? 'bg-white text-[#1a478e] shadow-sm font-semibold' : 'text-gray-500 hover:text-[#1a478e] hover:bg-white/50'}`}
              title="List View"
            >
              <BiListUl className="text-xl" />
              <span className="text-sm hidden sm:block">Ro'yxat</span>
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-32">
            <div className="w-12 h-12 border-[5px] border-[#1a478e]/30 border-t-[#1a478e] rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-medium">Yuklanmoqda...</p>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-2xl border border-dashed border-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-700">Kitoblar topilmadi</h3>
            <p className="text-gray-500 mt-2">Hozircha tizimda yuqori baholangan kitoblar mavjud emas.</p>
          </div>
        ) : (
          <>
            <div className={`transition-all duration-300 ${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 xl:gap-8' : 'flex flex-col gap-4'}`}>
              {viewMode === 'grid' 
                ? books.map((book, idx) => (
                    <div key={book.id} style={{ animationDelay: `${idx * 50}ms` }} className="animate-fade-in-up">
                      <NewArrivalCard book={book} />
                    </div>
                  ))
                : books.map((book, idx) => (
                    <div key={book.id} style={{ animationDelay: `${idx * 50}ms` }} className="animate-fade-in-up">
                      <BookRowItem book={book} />
                    </div>
                  ))
              }
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-14 gap-2">
                <button 
                  onClick={() => {
                    setPage(p => Math.max(1, p - 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={page === 1}
                  className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 border border-gray-200 bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:text-[#1a478e] hover:border-gray-300 hover:shadow-sm"
                >
                  Orqaga
                </button>
                <div className="flex items-center gap-1.5 mx-2 hidden sm:flex">
                  {[...Array(totalPages)].map((_, idx) => {
                    const pageNum = idx + 1;
                    if (pageNum === 1 || pageNum === totalPages || (pageNum >= page - 1 && pageNum <= page + 1)) {
                      return (
                        <button 
                          key={pageNum}
                          onClick={() => {
                            setPage(pageNum);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className={`w-11 h-11 flex items-center justify-center rounded-xl font-bold text-[15px] transition-all duration-200 ${page === pageNum ? 'bg-[#1a478e] text-white shadow-[0_4px_12px_rgba(26,71,142,0.3)]' : 'bg-white text-gray-700 border border-gray-200 hover:border-[#1a478e] hover:text-[#1a478e]'}`}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (pageNum === page - 2 || pageNum === page + 2) {
                      return <span key={pageNum} className="px-2 text-gray-400 select-none">...</span>;
                    }
                    return null;
                  })}
                </div>
                <button 
                  onClick={() => {
                    setPage(p => Math.min(totalPages, p + 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={page === totalPages}
                  className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 border border-gray-200 bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:text-[#1a478e] hover:border-gray-300 hover:shadow-sm"
                >
                  Oldinga
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.4s ease-out forwards;
          opacity: 0;
        }
      `}} />
    </div>
  );
}
