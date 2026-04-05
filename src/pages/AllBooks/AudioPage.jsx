import { useEffect, useState } from "react";
import { fetchBooks, getAuthors, getTags } from "../../services/bookService";
import { fetchCategories } from "../../services/additional";
import FilterBar from "./components/FilterBar";
import SearchBar from "./components/SearchBar";
import BookGrid from "./components/BookGrid";

export default function AudioPage() {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [books, setBooks] = useState([]);
  const [tags, setTags] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);

  const initialFilters = {
    search: "",
    sort: "rating-high",
    category: "",
    tag: "",
    author: "",
    book_format: {
      is_physical: true,
      is_audio: false,
      is_pdf: true,
    },
  };

  const [stagedFilters, setStagedFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);

  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    const loadBooks = async () => {
      setIsLoading(true);
      try {
        const fetchedBooks = await fetchBooks(appliedFilters);
        setBooks(fetchedBooks);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    loadBooks();
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
      setAppliedFilters(newFilters);
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

  const handleLoadMore = () => {
    console.log("Keyingi kitoblar yuklanmoqda...");
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans">
      <div className="bg-[#f2f4f7] py-3">
        <div className="custom-container mx-auto px-4 text-sm font-medium text-[#143c7b]">
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
            handleLoadMore={handleLoadMore}
            isLoading={isLoading}
          />
        </main>
      </div>
    </div>
  );
}
