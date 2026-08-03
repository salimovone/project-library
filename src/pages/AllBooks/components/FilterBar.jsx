import { BiFilterAlt } from "react-icons/bi";
import SearchableSelect from "./SearchableSelect";

export default function FilterBar({
  filters,
  handleInputChange,
  handleResetFilter,
  handleApplyFilter,
  categories,
  tags,
  authors,
  isMobileFilterOpen,
  setIsMobileFilterOpen,
}) {
  const formats = filters.book_format || { is_pdf: true, is_audio: true, is_physical: true };

  const toggleFormat = (key) => {
    const updated = { ...formats, [key]: !formats[key] };
    handleInputChange({
      target: { name: "book_format", value: updated },
    });
  };

  return (
    <>
      <button
        onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
        className="lg:hidden flex items-center justify-center gap-2 w-full rounded-xl bg-[var(--bg-card)] border border-[var(--navy-primary)] py-3 text-sm font-bold text-[var(--navy-primary)] dark:text-white transition shadow-xs cursor-pointer mb-4"
      >
        <BiFilterAlt className="text-lg" />
        {isMobileFilterOpen ? "Filtrni yopish" : "Filtrlash"}
      </button>

      <aside
        className={`w-full lg:w-[280px] 2xl:w-[300px] shrink-0 self-start ${
          isMobileFilterOpen ? "block" : "hidden"
        } lg:block font-interface min-w-0`}
      >
        <div className="w-full bg-[var(--bg-card)] rounded-2xl p-5 shadow-xs border border-[var(--border-main)] lg:sticky lg:top-24 transition-colors duration-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-extrabold text-[var(--text-main)] tracking-tight">
              Filtrlash
            </h2>
            <button
              onClick={handleResetFilter}
              className="text-xs font-bold text-[var(--crimson-primary)] hover:underline cursor-pointer"
            >
              Tozalash
            </button>
          </div>

          {/* Active Filter Chips */}
          {(filters.category || filters.tag || filters.author) && (
            <div className="flex flex-wrap gap-1.5 mb-4.5">
              {filters.category && (
                <span className="flex items-center gap-1.5 text-[11.5px] font-bold text-[var(--navy-primary)] bg-[var(--navy-light)] rounded-md px-2 py-1">
                  Kategoriya
                  <button onClick={() => handleInputChange({ target: { name: "category", value: "" } })} className="cursor-pointer text-gray-400 hover:text-gray-600">✕</button>
                </span>
              )}
              {filters.tag && (
                <span className="flex items-center gap-1.5 text-[11.5px] font-bold text-[var(--navy-primary)] bg-[var(--navy-light)] rounded-md px-2 py-1">
                  Tag
                  <button onClick={() => handleInputChange({ target: { name: "tag", value: "" } })} className="cursor-pointer text-gray-400 hover:text-gray-600">✕</button>
                </span>
              )}
            </div>
          )}

          <div className="flex flex-col gap-4">
            <SearchableSelect
              name="category"
              label="Kategoriya"
              value={filters.category}
              onChange={handleInputChange}
              options={categories}
            />

            <SearchableSelect
              name="tag"
              label="Taglar"
              value={filters.tag}
              onChange={handleInputChange}
              options={tags}
            />

            <SearchableSelect
              name="author"
              label="Muallif"
              value={filters.author}
              onChange={handleInputChange}
              options={authors}
            />

            <div className="h-px bg-[var(--border-main)] my-1" />

            {/* Formats Checkboxes */}
            <div className="flex flex-col gap-2.5">
              <span className="text-[11.5px] font-extrabold tracking-wider uppercase text-[var(--text-subtle)]">
                Format
              </span>
              
              <label className="flex items-center justify-between text-[13.5px] font-semibold text-[var(--text-main)] cursor-pointer select-none">
                <span className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={!!formats.is_pdf}
                    onChange={() => toggleFormat("is_pdf")}
                    className="w-4.5 h-4.5 rounded accent-[var(--navy-primary)] cursor-pointer"
                  />
                  PDF bor
                </span>
              </label>

              <label className="flex items-center justify-between text-[13.5px] font-semibold text-[var(--text-main)] cursor-pointer select-none">
                <span className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={!!formats.is_audio}
                    onChange={() => toggleFormat("is_audio")}
                    className="w-4.5 h-4.5 rounded accent-[var(--navy-primary)] cursor-pointer"
                  />
                  Audio bor
                </span>
              </label>

              <label className="flex items-center justify-between text-[13.5px] font-semibold text-[var(--text-main)] cursor-pointer select-none">
                <span className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={!!formats.is_physical}
                    onChange={() => toggleFormat("is_physical")}
                    className="w-4.5 h-4.5 rounded accent-[var(--navy-primary)] cursor-pointer"
                  />
                  Kutubxonada bor
                </span>
              </label>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="mt-6 flex flex-col gap-2.5">
            <button
              onClick={handleApplyFilter}
              className="w-full h-11 rounded-xl bg-[var(--navy-primary)] text-white text-sm font-bold shadow-xs hover:opacity-90 transition cursor-pointer"
            >
              Natijani ko'rsatish
            </button>
            <button
              onClick={handleResetFilter}
              className="w-full h-11 rounded-xl border border-[var(--border-strong)] bg-[var(--bg-card)] text-[var(--text-muted)] text-sm font-bold hover:bg-[var(--bg-subtle)] transition cursor-pointer"
            >
              Filtrni qaytarish
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
