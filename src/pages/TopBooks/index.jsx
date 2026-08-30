import React, { useEffect, useState } from "react";
import { fetchTopBooksPaginated } from "../../services/bookService";
import BookCard from "../../components/BookCard";
import MostReadCard from "../../components/MostReadCard";
import { BiGridAlt, BiListUl } from "react-icons/bi";
import { Link, useNavigate } from "react-router";

export default function TopBooks() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("grid");
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const limit = 12;

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    fetchTopBooksPaginated(page, limit)
      .then((response) => {
        if (isMounted) {
          setBooks(response.results || []);
          setTotalCount(response.count || response.results?.length || 0);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [page]);

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="min-h-screen bg-[var(--bg-page)] font-interface transition-colors duration-300 pb-16">
      {/* Breadcrumbs Bar */}
      <div className="bg-[var(--bg-card)] border-b border-[var(--border-main)] py-3 px-4 md:px-10">
        <div className="max-w-[1320px] mx-auto flex items-center gap-2 text-xs md:text-sm font-semibold text-[var(--text-subtle)]">
          <Link to="/" className="text-[var(--navy-primary)] dark:text-blue-300 hover:underline">
            Bosh sahifa
          </Link>
          <span>/</span>
          <span className="text-[var(--text-main)] font-bold">Top Kitoblar</span>
        </div>
      </div>

      <div className="max-w-[1320px] mx-auto px-4 md:px-10 py-8 flex flex-col gap-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl p-5 shadow-xs">
          <div className="flex flex-col gap-1">
            <h1 className="font-editorial text-3xl font-normal text-[var(--text-main)]">
              Eng ko'p o'qilgan kitoblar
            </h1>
            <span className="text-xs text-[var(--text-subtle)]">
              Kitobxonlar va talabalar tomonidan eng yuqori baholangan nashrlar
            </span>
          </div>

          <div className="flex items-center bg-[var(--bg-subtle)] border border-[var(--border-main)] rounded-xl p-1 shrink-0">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                viewMode === "grid"
                  ? "bg-[var(--navy-primary)] text-white shadow-xs"
                  : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
              }`}
            >
              <BiGridAlt className="text-base" /> Setka
            </button>
            <button
              onClick={() => setViewMode("row")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                viewMode === "row"
                  ? "bg-[var(--navy-primary)] text-white shadow-xs"
                  : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
              }`}
            >
              <BiListUl className="text-base" /> Ro'yxat
            </button>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center items-center py-24 text-[var(--navy-primary)] font-bold text-base">
            Yuklanmoqda...
          </div>
        ) : books.length === 0 ? (
          <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl p-12 text-center text-[var(--text-muted)]">
            Hozircha tizimda yuqori baholangan kitoblar topilmadi.
          </div>
        ) : (
          <>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {books.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onClick={() => navigate(`/books/${book.id}`)}
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {books.map((book, idx) => (
                  <MostReadCard key={book.id} book={book} rank={(page - 1) * limit + idx + 1} />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => {
                    setPage((p) => Math.max(1, p - 1));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  disabled={page === 1}
                  className="h-10 px-4 rounded-xl font-bold text-xs border border-[var(--border-strong)] bg-[var(--bg-card)] text-[var(--text-muted)] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[var(--navy-primary)] transition cursor-pointer"
                >
                  Orqaga
                </button>

                <div className="flex items-center gap-1.5 mx-2">
                  {[...Array(totalPages)].map((_, idx) => {
                    const pageNum = idx + 1;
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= page - 1 && pageNum <= page + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => {
                            setPage(pageNum);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className={`w-10 h-10 rounded-xl font-extrabold text-xs transition cursor-pointer ${
                            page === pageNum
                              ? "bg-[var(--navy-primary)] text-white shadow-xs"
                              : "bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border-main)] hover:border-[var(--navy-primary)]"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => {
                    setPage((p) => Math.min(totalPages, p + 1));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  disabled={page === totalPages}
                  className="h-10 px-4 rounded-xl font-bold text-xs border border-[var(--border-strong)] bg-[var(--bg-card)] text-[var(--navy-primary)] dark:text-white disabled:opacity-40 disabled:cursor-not-allowed hover:border-[var(--navy-primary)] transition cursor-pointer"
                >
                  Oldinga
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
