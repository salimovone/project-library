import { CgSearch } from "react-icons/cg";
import { BiChevronDown } from "react-icons/bi";

export default function SearchBar({ filters, handleInputChange }) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
      <div className="relative flex-1 w-full text-[#143c7b]">
        <input
          type="search"
          name="search"
          value={filters.search}
          onChange={handleInputChange}
          placeholder="Kitob nomi, muallif ..."
          className="w-full rounded-xl bg-white border border-gray-200 pl-11 pr-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
        />
        <span className="absolute left-4 top-3.5 text-lg text-gray-400">
          <CgSearch />
        </span>
      </div>

      <div className="relative w-full sm:w-64">
        <select
          name="sort"
          value={filters.sort}
          onChange={handleInputChange}
          className="w-full appearance-none rounded-xl border border-gray-200 bg-white pl-4 pr-10 py-3 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
        >
          <option value="rating-high">Reyting (Yuqorisidan)</option>
          <option value="rating-low">Reyting (Pastidan)</option>
          <option value="latest">Yangi qo'shilganlar</option>
          <option value="oldest">Eskilari</option>
          <option value="name-high">Nomi (A-Z)</option>
          <option value="name-low">Nomi (Z-A)</option>
          <option value="published-date-high">
            Nashr qilingan sana (Yuqorisidan)
          </option>
          <option value="published-date-low">
            Nashr qilingan sana (Pastidan)
          </option>
        </select>
        <BiChevronDown className="absolute right-4 top-3.5 text-gray-500 text-xl pointer-events-none" />
      </div>
    </div>
  );
}
