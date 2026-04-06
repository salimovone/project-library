import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router"; // react-router-dom dan olinishi kerak
import { fetchCategories, fetchSubcategories } from "../services/additional";
import { getAuthors } from "../services/bookService";

export default function BookCreatePage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // 1. Asosiy ma'lumotlar state'i
  const [bookData, setBookData] = useState({
    name: "",
    author_ids: "",
    isbn: "",
    category_id: "",
    subcategory_id: "",
    quantity: "",
    tags: "", 
    description: "",
    pages: "",
    published_date: new Date().toISOString().split("T")[0],
  });

  // 2. API dan keladigan ro'yxatlar
  const [options, setOptions] = useState({
    categories: [],
    subcategories: [],
    authors: [],
  });

  // 3. Dinamik rasmlar ro'yxati state'i (order avtomatik 1 dan boshlanadi)
  const [images, setImages] = useState([
    { id: Date.now(), file: null, order: 1 },
  ]);

  // =====================================================================
  // API LARDAN MA'LUMOT YUKLASH (Component mount bo'lganda)
  // =====================================================================
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [catRes, subCatRes, authRes] = await Promise.all([
          fetchCategories(),
          fetchSubcategories(),
          getAuthors(),
        ]);

        setOptions({
          categories: catRes || [],
          subcategories: subCatRes || [],
          authors: authRes || [],
        });
      } catch (error) {
        console.error("Ma'lumotlarni yuklashda xatolik:", error);
      }
    };

    fetchOptions();
  }, []);

  // Form inputlarini boshqarish
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookData((prev) => ({ ...prev, [name]: value }));
  };

  // Yangi rasm qatori qo'shish (Avtomatik order berish)
  const addImageRow = () => {
    const nextOrder = images.length > 0 ? Math.max(...images.map(i => i.order)) + 1 : 1;
    setImages([...images, { id: Date.now(), file: null, order: nextOrder }]);
  };

  // Rasm qatorini o'chirish
  const removeImageRow = (id) => {
    if (images.length > 1) {
      setImages(images.filter((img) => img.id !== id));
    }
  };

  // Rasm qiymatlarini o'zgartirish
  const handleImageChange = (id, field, value) => {
    setImages(
      images.map((img) => (img.id === id ? { ...img, [field]: value } : img))
    );
  };

  // =====================================================================
  // FORMANI YUBORISH MANTIG'I (FormData yordamida file + text yuborish)
  // =====================================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const parsedTags = bookData.tags
        ? bookData.tags.split(",").map((t) => Number(t.trim())).filter((n) => !isNaN(n))
        : [0];

      // File va ma'lumotlarni birga yuborish uchun FormData ishlatamiz
      const formData = new FormData();
      
      formData.append("name", bookData.name);
      formData.append("description", bookData.description);
      formData.append("isbn", bookData.isbn);
      formData.append("rating", 0);
      formData.append("is_available", Number(bookData.quantity) > 0);
      formData.append("is_frequent", false);
      formData.append("quantity", Number(bookData.quantity) || 0);
      formData.append("published_date", bookData.published_date);
      formData.append("pdf", "");
      formData.append("audio", "");
      formData.append("is_physical", true);
      formData.append("pages", Number(bookData.pages) || 0);
      formData.append("category_id", Number(bookData.category_id));
      formData.append("subcategory_id", Number(bookData.subcategory_id));
      formData.append("author_ids", Number(bookData.author_ids));

      // Array ko'rinishidagi datalarni (masalan tag_ids) qo'shish
      parsedTags.forEach(tag => {
        formData.append("tag_ids", tag); 
      });

      // 1-Rasmni (index 0) FormData'ga qo'shish (Agar tanlangan bo'lsa)
      if (images.length > 0 && images[0].file) {
        // Backend img ni file obyekti sifatida kutayotgan deb hisoblaymiz
        formData.append("img", images[0].file); 
      }

      // API ga POST qilish
      const response = await fetch(import.meta.env.VITE_API_BASE+"kitob/", {
        method: "POST",
        // DIQQAT: fetch bilan FormData yuborilganda "Content-Type" ni umuman yozmaslik kerak,
        // Browser o'zi "multipart/form-data" va kerakli "boundary" ni avtomat qo'yib beradi.
        headers: {
          // "Authorization": `Bearer ${token}` // Agar token kerak bo'lsa
        },
        body: formData,
      });

      if (response.ok) {
        alert("Kitob muvaffaqiyatli saqlandi!");
        navigate("/books"); 
      } else {
        alert("Saqlashda xatolik yuz berdi.");
      }
    } catch (error) {
      console.error("Xatolik:", error);
      alert("Tarmoqda xatolik yuz berdi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20 font-sans">
      {/* Breadcrumb */}
      <div className="bg-[#f2f4f7] py-3">
        <div className="custom-container mx-auto px-4 text-sm font-medium text-[#143c7b]">
          <Link to="/">Home</Link> / Book Create
        </div>
      </div>

      <div className="custom-container mx-auto px-4 mt-8">
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-8">
          
          {/* 1. ASOSIY MA'LUMOTLAR FORMASI */}
          <div className="bg-[#f6f8fa] border border-[#d1d9e6] rounded-3xl p-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#143c7b]">Kitob nomi *</label>
                <input
                  name="name"
                  type="text"
                  placeholder="Kitob nomi kiriting ...."
                  className="w-full bg-white border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Muallifni tanlash (Dropdown) */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#143c7b]">Muallifi *</label>
                <select
                  name="author_ids"
                  className="w-full bg-white border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Muallifni tanlang</option>
                  {options.authors.map((author) => (
                    <option key={author.id} value={author.id}>
                      {author.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#143c7b]">ISBN *</label>
                <input
                  name="isbn"
                  type="text"
                  placeholder="Kitob isbn kiriting ...."
                  className="w-full bg-white border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Kategoriyani tanlash */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#143c7b]">Kategoriya *</label>
                <select
                  name="category_id"
                  className="w-full bg-white border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Kategoriyani tanlang</option>
                  {options.categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

               {/* SubKategoriyani tanlash */}
               <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#143c7b]">Ost-kategoriya *</label>
                <select
                  name="subcategory_id"
                  className="w-full bg-white border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Ost-kategoriyani tanlang</option>
                  {options.subcategories.map((subcat) => (
                    <option key={subcat.id} value={subcat.id}>
                      {subcat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#143c7b]">Sahifalar soni *</label>
                <input
                  name="pages"
                  type="number"
                  placeholder="Sahifalar sonini kiriting ...."
                  className="w-full bg-white border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#143c7b]">Miqdori</label>
                <input
                  name="quantity"
                  type="number"
                  placeholder="Kitob sonini kiriting ...."
                  className="w-full bg-white border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#143c7b]">Taglar (ID larni vergul bilan ajrating)</label>
                <input
                  name="tags"
                  type="text"
                  placeholder="Masalan: 1, 2, 5"
                  className="w-full bg-white border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="mt-6 space-y-1.5">
              <label className="text-sm font-bold text-[#143c7b]">Tavsifi</label>
              <textarea
                name="description"
                rows="6"
                placeholder="Kitob haqida kiriting ...."
                className="w-full bg-white border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* 2. RASMLAR JADVALI */}
          <div className="bg-[#f6f8fa] border border-[#d1d9e6] rounded-3xl overflow-hidden shadow-sm">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="border-b border-[#d1d9e6]">
                  <th className="py-4 text-sm font-bold text-[#143c7b]">Kitob rasmi</th>
                  <th className="py-4 text-sm font-bold text-[#143c7b]">Tartib raqam</th>
                  <th className="py-4 text-sm font-bold text-[#143c7b]">O'chirish</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {images.map((imgRow) => (
                  <tr key={imgRow.id} className="border-b border-[#f2f4f7] last:border-none">
                    <td className="p-4">
                      <input
                        type="file"
                        accept="image/*"
                        className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        onChange={(e) => handleImageChange(imgRow.id, "file", e.target.files[0])}
                      />
                    </td>
                    <td className="p-4">
                      <input
                        type="number"
                        placeholder="Tartib raqam ..."
                        className="w-full max-w-37.5 mx-auto border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none"
                        value={imgRow.order}
                        onChange={(e) => handleImageChange(imgRow.id, "order", e.target.value)}
                      />
                    </td>
                    <td className="p-4">
                      <button
                        type="button"
                        onClick={() => removeImageRow(imgRow.id)}
                        className="bg-[#d62d30] text-white px-8 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition"
                      >
                        O'chirish
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-6 bg-white flex justify-center border-t border-[#f2f4f7]">
              <button
                type="button"
                onClick={addImageRow}
                className="bg-[#1a73e8] text-white px-10 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 transition shadow-md"
              >
                Yana bitta qo'shish
              </button>
            </div>
          </div>

          {/* SAQLASH TUGMASI */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`bg-[#003282] text-white px-12 py-3.5 rounded-xl font-bold transition shadow-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-900'}`}
            >
              {isLoading ? "Saqlanmoqda..." : "Kitobni saqlash"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}