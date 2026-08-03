import { BiChevronDown } from "react-icons/bi";

export default function SearchBar({ filters, handleInputChange, handleSearchSubmit }) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 mb-6 font-interface">
      {/* Search Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (handleSearchSubmit) handleSearchSubmit();
        }}
        className="relative flex-1 w-full flex items-center h-12 px-4 bg-[var(--bg-card)] border border-[var(--border-main)] rounded-xl shadow-xs focus-within:border-[var(--navy-primary)] transition"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#8a93a6" strokeWidth="2.4" strokeLinecap="round" className="shrink-0">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-4.2-4.2" />
        </svg>
        <input
          type="text"
          name="search"
          value={filters.search || ""}
          onChange={handleInputChange}
          placeholder="Kitob nomi, muallif, ISBN…"
          className="w-full bg-transparent ml-3 text-sm font-semibold text-[var(--text-main)] placeholder-[#8a93a6] outline-none"
        />
        {filters.search && (
          <button
            type="button"
            onClick={() => handleInputChange({ target: { name: "search", value: "" } })}
            className="text-xs font-bold text-[var(--text-subtle)] hover:text-[var(--text-main)] cursor-pointer"
          >
            ✕
          </button>
        )}
      </form>

      {/* Sort Select */}
      <div className="relative w-full sm:w-60 h-12 flex items-center bg-[var(--bg-card)] border border-[var(--border-main)] rounded-xl px-4 shadow-xs">
        <select
          name="sort"
          value={filters.sort || "rating-high"}
          onChange={handleInputChange}
          className="w-full bg-transparent text-sm font-semibold text-[var(--text-main)] outline-none appearance-none pr-6 cursor-pointer"
        >
          <option value="rating-high">Reyting (yuqorisidan)</option>
          <option value="rating-low">Reyting (pastidan)</option>
          <option value="latest">Yangi qo'shilganlar</option>
          <option value="oldest">Eskilari</option>
          <option value="name-high">Nomi (A-Z)</option>
          <option value="name-low">Nomi (Z-A)</option>
        </select>
        <BiChevronDown className="absolute right-3.5 text-gray-400 text-lg pointer-events-none" />
      </div>
    </div>
  );
}
