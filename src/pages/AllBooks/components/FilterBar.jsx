import { BiChevronDown, BiFilterAlt } from "react-icons/bi";
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

  return (
    <>
      <button
        onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
        className="md:hidden flex items-center justify-center gap-2 w-full rounded-xl bg-white border border-[#003282] py-3 text-sm font-semibold text-[#003282] transition shadow-sm"
      >
        <BiFilterAlt className="text-lg" />
        {isMobileFilterOpen ? "Filtrni yopish" : "Filtrlash"}
      </button>

      <aside
        className={`w-full md:w-65 lg:w-70 shrink-0 self-start ${
          isMobileFilterOpen ? "block" : "hidden"
        } md:block`}
      >
        <div className="bg-white rounded-2xl p-5 lg:p-6 shadow-sm border border-gray-100 md:sticky md:top-24 md:max-h-[calc(100vh-120px)] md:overflow-y-auto">
          <h2 className="text-[18px] font-bold text-[#143c7b] mb-4 border-b border-gray-100 pb-4">
            Filtrlash
          </h2>

          <div className="space-y-4">
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
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <button
              onClick={handleResetFilter}
              className="w-full rounded-lg border border-[#143c7b] bg-white py-2.5 text-sm font-semibold text-[#143c7b] transition hover:bg-gray-50"
            >
              Filterni qaytarish
            </button>
            <button
              onClick={handleApplyFilter}
              className="w-full rounded-lg bg-[#003282] py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 shadow-md"
            >
              Natijani ko'rsatish
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
