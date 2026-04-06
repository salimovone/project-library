import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router"; // react-router-dom dan olinishi kerak
import { fetchCategories, fetchSubcategories, fetchTags } from "../services/additional";
import { getAuthors } from "../services/bookService";
import api from "../services/api";

export default function BookCreatePage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [bookData, setBookData] = useState({
    name: "",
    author_ids: [], 
    isbn: "",
    category_id: "",
    subcategory_id: "",
    quantity: "",
    tag_ids: [], 
    description: "",
    pages: "",
    published_date: new Date().toISOString().split("T")[0],
  });

  const [options, setOptions] = useState({
    categories: [],
    subcategories: [],
    authors: [],
    tags: [],
  });

  const [images, setImages] = useState([
    { id: Date.now(), file: null, order: 1 },
  ]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [catRes, subCatRes, authRes, tagsRes] = await Promise.all([
          fetchCategories(),
          fetchSubcategories(),
          getAuthors(),
          fetchTags(),
        ]);

        setOptions({
          categories: catRes || [],
          subcategories: subCatRes || [],
          authors: authRes || [],
          tags: tagsRes || [],
        });
      } catch (error) {
        console.error("Ma'lumotlarni yuklashda xatolik:", error);
      }
    };

    fetchOptions();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectChange = (e) => {
    const { name, options } = e.target;
    const selectedValues = Array.from(options)
      .filter(option => option.selected)
      .map(option => Number(option.value)); 
    
    setBookData((prev) => ({ ...prev, [name]: selectedValues }));
  };

  const addImageRow = () => {
    const nextOrder = images.length > 0 ? Math.max(...images.map(i => i.order)) + 1 : 1;
    setImages([...images, { id: Date.now(), file: null, order: nextOrder }]);
  };

  const removeImageRow = (id) => {
    if (images.length > 1) {
      setImages(images.filter((img) => img.id !== id));
    }
  };

  const handleImageChange = (id, field, value) => {
    setImages(
      images.map((img) => (img.id === id ? { ...img, [field]: value } : img))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // JSON (Payload) obyekti aynan backend kutayotgan tiplar bilan yasalmoqda
      const payload = {
        name: bookData.name,
        description: bookData.description,
        isbn: bookData.isbn,
        is_available: Number(bookData.quantity) > 0, // Boolean
        is_frequent: true,                           // Boolean (Sizning JSON dagi kabi)
        quantity: Number(bookData.quantity) || 0,    // Number
        published_date: bookData.published_date,     // String (YYYY-MM-DD)
        is_physical: true,                           // Boolean
        pages: Number(bookData.pages) || 0,          // Number
        category_id: Number(bookData.category_id),   // Number
        subcategory_id: Number(bookData.subcategory_id), // Number
        // Array formatidagi ma'lumotlar
        tag_ids: bookData.tag_ids.length > 0 ? bookData.tag_ids.map(Number) : [0], 
        author_ids: bookData.author_ids.length > 0 ? bookData.author_ids.map(Number) : [0]
      };

      // FormData o'rniga to'g'ridan-to'g'ri JSON yuboramiz
      await api.post('/kitob/', payload);

      // Rasmlarni yuklash (Hozircha faqat UI'da turibdi, keyinchalik bu yerga qo'shiladi)
      // if (images.length > 0 && images[0].file) {
      //    const imgData = new FormData();
      //    imgData.append("file", images[0].file);
      //    await api.post('/upload-image/', imgData);
      // }

      alert("Kitob muvaffaqiyatli saqlandi!");
      navigate("/books"); 

    } catch (error) {
      console.error("Xatolik:", error);
      alert(error.message || "Saqlashda xatolik yuz berdi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20 font-sans">
      <div className="bg-[#f2f4f7] py-3">
        <div className="custom-container mx-auto px-4 text-sm font-medium text-[#143c7b]">
          <Link to="/">Home</Link> / Book Create
        </div>
      </div>

      <div className="custom-container mx-auto px-4 mt-8">
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-8">
          
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

              {/* Mualliflar (Multiple) */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#143c7b]">Mualliflar * (Ctrl bilan bir nechta tanlang)</label>
                <select
                  multiple
                  name="author_ids"
                  className="w-full bg-white border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  onChange={handleMultiSelectChange}
                  required
                >
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

              {/* Teglar (Multiple) */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#143c7b]">Teglar (Ctrl bilan bir nechta tanlang)</label>
                <select
                  multiple
                  name="tag_ids"
                  className="w-full bg-white border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  onChange={handleMultiSelectChange}
                >
                  {options.tags.map((tag) => (
                    <option key={tag.id} value={tag.id}>
                      {tag.name}
                    </option>
                  ))}
                </select>
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