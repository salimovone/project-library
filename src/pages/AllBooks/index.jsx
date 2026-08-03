import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { fetchBooks, getAuthors, getTags } from "../../services/bookService";
import { fetchCategories } from "../../services/additional";
import FilterBar from "./components/FilterBar";
import SearchBar from "./components/SearchBar";
import BookGrid from "./components/BookGrid";

export default function AllBooks() {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [books, setBooks] = useState([]);
  const [tags, setTags] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const location = useLocation();
  const stateData = location.state || {};

  const initialFilters = {
    search: stateData.search || "",
    sort: "rating-high",
    category: stateData.category || "",
    subcategory: stateData.subcategory || "",
    tag: "",
    author: "",
    book_format: {
      is_physical: true,
      is_audio: true,
      is_pdf: true,
    },
  };

  const [stagedFilters, setStagedFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 12;
  const totalPages = Math.ceil(totalCount / limit);

  useEffect(() => {
    if (location.state) {
      setStagedFilters((prev) => ({
        ...prev,
        category: location.state.category || prev.category,
        subcategory: location.state.subcategory || prev.subcategory,
        search: location.state.search || prev.search,
      }));
      setAppliedFilters((prev) => ({
        ...prev,
        category: location.state.category || prev.category,
        subcategory: location.state.subcategory || prev.subcategory,
        search: location.state.search || prev.search,
      }));
    }
  }, [location.state]);

  useEffect(() => {
    const fetchSideData = async () => {
      try {
        await Promise.all([
          fetchCategories().then(setCategories),
          getAuthors().then(setAuthors),
          getTags().then(setTags),
        ]);
      } catch (error) {
        console.error("Side data error:", error);
      }
    };

    fetchSideData();
  }, []);

  const loadBooks = async (page = 1) => {
    setIsLoading(true);

    try {
      const data = await fetchBooks({ ...appliedFilters, page, page_size: limit });
      setBooks(data.results || []);
      setTotalCount(data.count || data.results?.length || 0);
      setCurrentPage(page);
    } catch (error) {
      console.error("Books load error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBooks(1);
  }, [appliedFilters]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "search") {
      setStagedFilters((prev) => ({ ...prev, search: value }));
      if (value === "") {
        setAppliedFilters((prev) => ({ ...prev, search: "" }));
      }
    } else if (name === "sort") {
      const newFilters = { ...stagedFilters, sort: value };
      setStagedFilters(newFilters);
      setAppliedFilters(newFilters);
    } else if (name === "book_format") {
      setStagedFilters((prev) => ({ ...prev, book_format: value }));
    } else {
      setStagedFilters((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleApplyFilter = () => {
    setAppliedFilters(stagedFilters);
  };

  const handleResetFilter = () => {
    setStagedFilters(initialFilters);
    setAppliedFilters(initialFilters);
  };

  const handlePageChange = (newPage) => {
    loadBooks(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppliedFilters((prev) => {
        if (prev.search !== stagedFilters.search) {
          return { ...stagedFilters, search: stagedFilters.search };
        }
        return prev;
      });
    }, 400);
    return () => clearTimeout(timer);
  }, [stagedFilters.search]);

  return (
    <div className="min-h-screen bg-[var(--bg-page)] font-interface transition-colors duration-300">
      {/* Breadcrumbs Bar */}
      <div className="bg-[var(--bg-card)] border-b border-[var(--border-main)] py-3 px-4 md:px-10">
        <div className="max-w-[1320px] mx-auto flex items-center gap-2 text-xs md:text-sm font-semibold text-[var(--text-subtle)]">
          <Link to="/" className="text-[var(--navy-primary)] dark:text-blue-300 hover:underline">
            Bosh sahifa
          </Link>
          <span>/</span>
          <span className="text-[var(--text-main)] font-bold">Kutubxona</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1320px] 2xl:max-w-[1680px] min-[1920px]:max-w-[1840px] min-[2560px]:max-w-[2240px] mx-auto px-4 md:px-10 py-8 grid grid-cols-1 lg:grid-cols-[280px_1fr] 2xl:grid-cols-[300px_1fr] gap-8 items-start min-w-0">
        <FilterBar
          filters={stagedFilters}
          handleInputChange={handleInputChange}
          handleResetFilter={handleResetFilter}
          handleApplyFilter={handleApplyFilter}
          categories={categories}
          tags={tags}
          authors={authors}
          isMobileFilterOpen={isMobileFilterOpen}
          setIsMobileFilterOpen={setIsMobileFilterOpen}
        />

        <main className="flex flex-col gap-4.5 w-full">
          <SearchBar
            filters={stagedFilters}
            handleInputChange={handleInputChange}
            handleSearchSubmit={() => setAppliedFilters({ ...stagedFilters })}
          />

          {/* Results Summary Bar */}
          <div className="flex items-center justify-between px-1">
            <span className="text-sm text-[var(--text-muted)] font-medium">
              <b className="text-[var(--text-main)] font-extrabold">{totalCount}</b> natija topildi
            </span>
            <span className="text-xs text-[var(--text-subtle)] font-semibold">
              {(currentPage - 1) * limit + 1}–{Math.min(currentPage * limit, totalCount)} ko'rsatilmoqda
            </span>
          </div>

          <BookGrid books={books} isLoading={isLoading} />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 my-6">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
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
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 rounded-xl font-extrabold text-xs transition cursor-pointer ${
                          currentPage === pageNum
                            ? "bg-[var(--navy-primary)] text-white shadow-xs"
                            : "bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border-main)] hover:border-[var(--navy-primary)]"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                    return (
                      <span key={pageNum} className="px-1 text-[var(--text-subtle)] font-bold">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="h-10 px-4 rounded-xl font-bold text-xs border border-[var(--border-strong)] bg-[var(--bg-card)] text-[var(--navy-primary)] dark:text-white disabled:opacity-40 disabled:cursor-not-allowed hover:border-[var(--navy-primary)] transition cursor-pointer"
              >
                Oldinga
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
