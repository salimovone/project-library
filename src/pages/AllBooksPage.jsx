import { CgSearch } from "react-icons/cg";
import { BiChevronDown, BiFilterAlt } from "react-icons/bi";
import { useEffect, useState } from "react";
import { fetchBooks } from "../services/bookService";
import { NewArrivalCard } from "../components";

export default function AllBooksPage() {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [books, setBooks] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    sort: "Reyting (Yuqorisidan)",
    category: "",
    tag: "",
    author: ""
  });

  let isMounted = false;
  useEffect(() => {
    if (isMounted) return;
    fetchBooks().then(setBooks);
    return () => {
      isMounted = true;
    };
  }, []);

  const handleInputChange = (e) => {
    // Input va Select'lardan kelgan ma'lumotlarni 'filters' state'iga dinamik yozish uchun
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApplyFilter = () => {
    // Ushbu funksiya "Natijani ko'rsatish" tugmasi bosilganda ishlashi kerak.
    // Bu yerda 'filters' state'idagi ma'lumotlarni API ga so'rov qilib yuborishingiz mumkin.
    console.log("Qo'llanilgan filtrlar:", filters);
  };

  const handleResetFilter = () => {
    // Ushbu funksiya filtrlarni tozalash (reset) qilish uchun ishlatiladi.
    // API ga boshlang'ich ma'lumotlarni chaqirish uchun qayta so'rov yuborish kerak bo'ladi.
    setFilters({
      search: "",
      sort: "Reyting (Yuqorisidan)",
      category: "",
      tag: "",
      author: ""
    });
  };

  const handleLoadMore = () => {
    // Ushbu funksiya eng pastdagi "Yana yuklash" tugmasi bosilganda ishlashi kerak.
    // Keyingi sahifadagi (pagination) kitoblarni olib kelish uchun API yoziladi.
    console.log("Keyingi kitoblar yuklanmoqda...");
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans">
      
      {/* Breadcrumb qismi */}
      <div className="bg-[#f2f4f7] py-3">
        <div className="custom-container mx-auto px-4 text-sm font-medium text-[#143c7b]">
          Home / Book List
        </div>
      </div>

      <div className="custom-container mx-auto px-4 py-8 flex flex-col md:flex-row gap-6 lg:gap-8 relative">
        
        {/* MOBIL UCHUN FILTR TUGMASI (Faqat kichik ekranlarda ko'rinadi) */}
        <button 
          onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
          className="md:hidden flex items-center justify-center gap-2 w-full rounded-xl bg-white border border-[#003282] py-3 text-sm font-semibold text-[#003282] transition shadow-sm"
        >
          <BiFilterAlt className="text-lg" />
          {isMobileFilterOpen ? "Filtrni yopish" : "Filtrlash"}
        </button>

        {/* CHAP TOMON: Filtrlash (Sidebar) */}
        <aside className={`w-full md:w-65 lg:w-70 shrink-0 self-start ${isMobileFilterOpen ? 'block' : 'hidden'} md:block`}>
          {/* Laptop uchun qimirlamaydigan (sticky) va o'zi scroll bo'ladigan quti */}
          <div className="bg-white rounded-2xl p-5 lg:p-6 shadow-sm border border-gray-100 md:sticky md:top-24 md:max-h-[calc(100vh-120px)] md:overflow-y-auto">
            <h2 className="text-[18px] font-bold text-[#143c7b] mb-4 border-b border-gray-100 pb-4">Filtrlash</h2>
            
            <div className="space-y-4">
              {/* Kategoriya */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#143c7b]">Kategoriya</label>
                <div className="relative">
                  <select 
                    name="category"
                    value={filters.category}
                    onChange={handleInputChange}
                    className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Barchasi</option>
                    <option value="hikoyalar">Hikoyalar</option>
                    <option value="romanlar">Romanlar</option>
                  </select>
                  <BiChevronDown className="absolute right-3 top-2.5 text-gray-500 text-lg pointer-events-none" />
                </div>
              </div>

              {/* Taglar */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#143c7b]">Taglar</label>
                <div className="relative">
                  <select 
                    name="tag"
                    value={filters.tag}
                    onChange={handleInputChange}
                    className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Barchasi</option>
                    <option value="yangi">Yangi</option>
                    <option value="top">Top</option>
                  </select>
                  <BiChevronDown className="absolute right-3 top-2.5 text-gray-500 text-lg pointer-events-none" />
                </div>
              </div>

              {/* Muallif */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#143c7b]">Muallif</label>
                <div className="relative">
                  <select 
                    name="author"
                    value={filters.author}
                    onChange={handleInputChange}
                    className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Barchasi</option>
                    <option value="abdulla_qodiriy">Abdulla Qodiriy</option>
                    <option value="otkir_hoshimov">O'tkir Hoshimov</option>
                  </select>
                  <BiChevronDown className="absolute right-3 top-2.5 text-gray-500 text-lg pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Filtr tugmalari */}
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

        {/* O'NG TOMON: Asosiy kontent */}
        <main className="flex-1 w-full">
          
          {/* Top Bar: Qidiruv va Saralash */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
            {/* Qidiruv */}
            <div className="relative flex-1 w-full text-[#143c7b]">
              <input 
                type="search" 
                name="search"
                value={filters.search}
                onChange={handleInputChange}
                placeholder="Kitob nomi, muallif ..." 
                className="w-full rounded-xl bg-white border border-gray-200 pl-11 pr-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm" 
              />
              <span className="absolute left-4 top-3.5 text-lg text-gray-400"><CgSearch /></span>
            </div>

            {/* Saralash (Sort) */}
            <div className="relative w-full sm:w-64">
              <select 
                name="sort"
                value={filters.sort}
                onChange={handleInputChange}
                className="w-full appearance-none rounded-xl border border-gray-200 bg-white pl-4 pr-10 py-3 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
              >
                <option value="Reyting (Yuqorisidan)">Reyting (Yuqorisidan)</option>
                <option value="Yangi qo'shilganlar">Yangi qo'shilganlar</option>
                <option value="Arzonlari">Arzonlari</option>
              </select>
              <BiChevronDown className="absolute right-4 top-3.5 text-gray-500 text-xl pointer-events-none" />
            </div>
          </div>

          {/* Kitoblar Grid'i */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
            {books.map((book) => (
              <NewArrivalCard key={book.id} book={book} />
            ))}
          </div>

          {/* Yana yuklash tugmasi */}
          <div className="mt-12 mb-8 flex justify-center">
            <button 
              onClick={handleLoadMore}
              className="rounded-full border border-[#003282] px-8 py-2.5 text-sm font-semibold text-[#003282] transition hover:bg-[#003282] hover:text-white"
            >
              Yana yuklash
            </button>
          </div>
          
        </main>
      </div>
    </div>
  );
}