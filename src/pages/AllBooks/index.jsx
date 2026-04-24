import { useEffect, useState } from "react";
import { useLocation } from "react-router";
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
    search: "",
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
      setStagedFilters(prev => ({
        ...prev,
        category: location.state.category || "",
        subcategory: location.state.subcategory || ""
      }));
      setAppliedFilters(prev => ({
        ...prev,
        category: location.state.category || "",
        subcategory: location.state.subcategory || ""
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBooks(1);
  }, [appliedFilters]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "search") {
      const newFilters = {
        ...initialFilters,
        search: value,
        sort: stagedFilters.sort,
      };
      setStagedFilters(newFilters);
    } else if (name === "sort") {
      const newFilters = { ...stagedFilters, sort: value };
      setStagedFilters(newFilters);
      setAppliedFilters(newFilters);
    } else if (name === "book_format") {
      // CheckboxGroup passes a value object, not a simple value
      setStagedFilters((prev) => ({
        ...prev,
        search: "",
        book_format: value,
      }));
    } else {
      setStagedFilters((prev) => ({
        ...prev,
        search: "",
        [name]: value,
      }));
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
          return { ...stagedFilters };
        }
        return prev;
      });
    }, 600);
    return () => clearTimeout(timer);
  }, [stagedFilters.search]);

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#121212] font-sans transition-colors duration-300">
      <div className="bg-[#f2f4f7] dark:bg-[#1a1a1a] py-3 transition-colors duration-300">
        <div className="custom-container mx-auto px-4 text-sm font-medium text-[#143c7b] dark:text-blue-300 transition-colors">
          Home / Book List
        </div>
      </div>

      <div className="custom-container mx-auto px-4 py-8 flex flex-col md:flex-row gap-6 lg:gap-8 relative">
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

        <main className="flex-1 w-full">
          <SearchBar filters={stagedFilters} handleInputChange={handleInputChange} />
          <BookGrid
            books={books}
            isLoading={isLoading}
          />

          {totalPages > 1 && (
            <div className="flex justify-center mt-8 mb-16 gap-2">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e1e1e] text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-[#252525] hover:text-[#1a478e] dark:hover:text-blue-400 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm"
              >
                Orqaga
              </button>
              <div className="items-center gap-1.5 mx-2 hidden sm:flex">
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
                        className={`w-11 h-11 flex items-center justify-center rounded-xl font-bold text-[15px] transition-all duration-200 ${
                          currentPage === pageNum
                            ? "bg-[#1a478e] dark:bg-blue-600 text-white shadow-[0_4px_12px_rgba(26,71,142,0.3)]"
                            : "bg-white dark:bg-[#1e1e1e] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-[#1a478e] dark:hover:border-blue-500 hover:text-[#1a478e] dark:hover:text-blue-400"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                    return (
                      <span key={pageNum} className="px-2 text-gray-400 select-none">
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
                className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e1e1e] text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-[#252525] hover:text-[#1a478e] dark:hover:text-blue-400 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm"
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
