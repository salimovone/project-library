import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router"; // react-router-dom dan olinishi kerak
import { fetchCategories, fetchSubcategories, fetchTags } from "../services/additional";
import { getAuthors, createAuthor, createTag } from "../services/bookService";
import { getMe } from "../services/userService";
import useRole from "../hooks/useRole";
import api from "../services/api";

export default function BookCreatePage() {
  const navigate = useNavigate();
  const { role } = useRole();
  const isTeacher = role === "teacher";
  const isLibrarian = role === "librarian" || role === "admin";
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null);

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

  const [pdfFile, setPdfFile] = useState(null);

  // Searchable select states
  const [authorSearch, setAuthorSearch] = useState("");
  const [tagSearch, setTagSearch] = useState("");
  const [authorDropdownOpen, setAuthorDropdownOpen] = useState(false);
  const [tagDropdownOpen, setTagDropdownOpen] = useState(false);
  const authorRef = useRef(null);
  const tagRef = useRef(null);

  // Create modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createModalType, setCreateModalType] = useState(""); // "author" or "tag"
  const [createModalValue, setCreateModalValue] = useState("");
  const [createModalLoading, setCreateModalLoading] = useState(false);

  const [options, setOptions] = useState({
    categories: [],
    subcategories: [],
    authors: [],
    tags: [],
  });

  const [images, setImages] = useState([
    { id: Date.now(), file: null, order: 1 },
  ]);

  // Fetch user data for teacher auto-fill
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getMe();
        setUserData(data);
      } catch (e) {
        console.error("User ma'lumotlarini yuklashda xatolik:", e);
      }
    };
    fetchUser();
  }, []);

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

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (authorRef.current && !authorRef.current.contains(e.target)) {
        setAuthorDropdownOpen(false);
      }
      if (tagRef.current && !tagRef.current.contains(e.target)) {
        setTagDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleAuthor = (authorId) => {
    setBookData((prev) => {
      const ids = prev.author_ids.includes(authorId)
        ? prev.author_ids.filter((id) => id !== authorId)
        : [...prev.author_ids, authorId];
      return { ...prev, author_ids: ids };
    });
  };

  const toggleTag = (tagId) => {
    setBookData((prev) => {
      const ids = prev.tag_ids.includes(tagId)
        ? prev.tag_ids.filter((id) => id !== tagId)
        : [...prev.tag_ids, tagId];
      return { ...prev, tag_ids: ids };
    });
  };

  const filteredAuthors = options.authors.filter((a) =>
    a.name.toLowerCase().includes(authorSearch.toLowerCase())
  );
  const filteredTags = options.tags.filter((t) =>
    t.name.toLowerCase().includes(tagSearch.toLowerCase())
  );

  const openCreateModal = (type) => {
    setCreateModalType(type);
    setCreateModalValue("");
    setShowCreateModal(true);
  };

  const handleCreateSubmit = async () => {
    if (!createModalValue.trim()) return;
    setCreateModalLoading(true);
    try {
      if (createModalType === "author") {
        const newAuthor = await createAuthor(createModalValue.trim());
        setOptions((prev) => ({ ...prev, authors: [...prev.authors, newAuthor] }));
        setBookData((prev) => ({ ...prev, author_ids: [...prev.author_ids, newAuthor.id] }));
      } else {
        const newTag = await createTag(createModalValue.trim());
        setOptions((prev) => ({ ...prev, tags: [...prev.tags, newTag] }));
        setBookData((prev) => ({ ...prev, tag_ids: [...prev.tag_ids, newTag.id] }));
      }
      setShowCreateModal(false);
    } catch (error) {
      console.error("Yaratishda xatolik:", error);
      alert("Yaratishda xatolik yuz berdi");
    } finally {
      setCreateModalLoading(false);
    }
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
      // For teacher: find or use their name as author
      let authorIds = bookData.author_ids;
      if (isTeacher && userData) {
        const teacherName = `${userData.first_name || ""} ${userData.last_name || ""}`.trim();
        const existingAuthor = options.authors.find(
          (a) => a.name.toLowerCase() === teacherName.toLowerCase()
        );
        if (existingAuthor) {
          authorIds = [existingAuthor.id];
        } else {
          try {
            const newAuthor = await createAuthor(teacherName);
            authorIds = [newAuthor.id];
          } catch {
            authorIds = [0];
          }
        }
      }

      // FormData bilan yuboramiz (fayl + ma'lumotlar)
      const formData = new FormData();
      formData.append("name", bookData.name);
      formData.append("description", bookData.description);
      formData.append("isbn", bookData.isbn);
      formData.append("is_available", Number(bookData.quantity) > 0);
      formData.append("is_frequent", true);
      formData.append("quantity", Number(bookData.quantity) || 0);
      formData.append("published_date", bookData.published_date);
      formData.append("is_physical", true);
      formData.append("pages", Number(bookData.pages) || 0);
      formData.append("category_id", Number(bookData.category_id));
      formData.append("subcategory_id", Number(bookData.subcategory_id));

      const tagIds = bookData.tag_ids.length > 0 ? bookData.tag_ids.map(Number) : [0];
      const finalAuthorIds = authorIds.length > 0 ? authorIds.map(Number) : [0];
      tagIds.forEach((id) => formData.append("tag_ids", id));
      finalAuthorIds.forEach((id) => formData.append("author_ids", id));

      // PDF fayl
      if (pdfFile) {
        formData.append("pdf", pdfFile);
      }

      // Rasmlar
      images.forEach((imgRow) => {
        if (imgRow.file) {
          formData.append("img", imgRow.file);
        }
      });

      await api.post('/kitob/', formData);

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
              
              {/* Kitob nomi - bigger field spanning full width */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-bold text-[#143c7b]">Kitob nomi *</label>
                <input
                  name="name"
                  type="text"
                  placeholder="Kitob nomi kiriting ...."
                  className="w-full bg-white border border-gray-300 rounded-xl py-4 px-5 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Mualliflar - only shown for librarian/admin */}
              {!isTeacher && (
                <div className="space-y-1.5" ref={authorRef}>
                  <label className="text-sm font-bold text-[#143c7b]">Mualliflar *</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Muallif qidirish..."
                        className="w-full bg-white border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={authorSearch}
                        onChange={(e) => setAuthorSearch(e.target.value)}
                        onFocus={() => setAuthorDropdownOpen(true)}
                      />
                      {authorDropdownOpen && (
                        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                          {filteredAuthors.length === 0 ? (
                            <div className="px-4 py-3 text-sm text-gray-500">Topilmadi</div>
                          ) : (
                            filteredAuthors.map((author) => (
                              <div
                                key={author.id}
                                className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-blue-50 flex items-center gap-2 ${
                                  bookData.author_ids.includes(author.id) ? "bg-blue-100 font-semibold" : ""
                                }`}
                                onClick={() => toggleAuthor(author.id)}
                              >
                                <span className={`w-4 h-4 rounded border flex items-center justify-center text-xs ${
                                  bookData.author_ids.includes(author.id) ? "bg-blue-600 border-blue-600 text-white" : "border-gray-300"
                                }`}>
                                  {bookData.author_ids.includes(author.id) && "✓"}
                                </span>
                                {author.name}
                              </div>
                            ))
                          )}
                        </div>
                      )}
                      {/* Selected chips */}
                      {bookData.author_ids.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {bookData.author_ids.map((id) => {
                            const author = options.authors.find((a) => a.id === id);
                            return author ? (
                              <span key={id} className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
                                {author.name}
                                <button type="button" onClick={() => toggleAuthor(id)} className="text-blue-600 hover:text-blue-900">×</button>
                              </span>
                            ) : null;
                          })}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => openCreateModal("author")}
                      className="bg-green-600 text-white px-4 py-3 rounded-xl text-sm font-bold hover:bg-green-700 transition whitespace-nowrap"
                    >
                      + Yaratish
                    </button>
                  </div>
                </div>
              )}

              {/* Teacher info notice */}
              {isTeacher && userData && (
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-[#143c7b]">Muallif</label>
                  <div className="w-full bg-gray-100 border border-gray-300 rounded-xl py-3 px-4 text-gray-600">
                    {`${userData.first_name || ""} ${userData.last_name || ""}`.trim() || "Avtomatik to'ldiriladi"}
                  </div>
                </div>
              )}

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

              {/* Teglar - searchable with create */}
              <div className="space-y-1.5" ref={tagRef}>
                <label className="text-sm font-bold text-[#143c7b]">Teglar</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Teg qidirish..."
                      className="w-full bg-white border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={tagSearch}
                      onChange={(e) => setTagSearch(e.target.value)}
                      onFocus={() => setTagDropdownOpen(true)}
                    />
                    {tagDropdownOpen && (
                      <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                        {filteredTags.length === 0 ? (
                          <div className="px-4 py-3 text-sm text-gray-500">Topilmadi</div>
                        ) : (
                          filteredTags.map((tag) => (
                            <div
                              key={tag.id}
                              className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-blue-50 flex items-center gap-2 ${
                                bookData.tag_ids.includes(tag.id) ? "bg-blue-100 font-semibold" : ""
                              }`}
                              onClick={() => toggleTag(tag.id)}
                            >
                              <span className={`w-4 h-4 rounded border flex items-center justify-center text-xs ${
                                bookData.tag_ids.includes(tag.id) ? "bg-blue-600 border-blue-600 text-white" : "border-gray-300"
                              }`}>
                                {bookData.tag_ids.includes(tag.id) && "✓"}
                              </span>
                              {tag.name}
                            </div>
                          ))
                        )}
                      </div>
                    )}
                    {/* Selected chips */}
                    {bookData.tag_ids.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {bookData.tag_ids.map((id) => {
                          const tag = options.tags.find((t) => t.id === id);
                          return tag ? (
                            <span key={id} className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">
                              {tag.name}
                              <button type="button" onClick={() => toggleTag(id)} className="text-green-600 hover:text-green-900">×</button>
                            </span>
                          ) : null;
                        })}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => openCreateModal("tag")}
                    className="bg-green-600 text-white px-4 py-3 rounded-xl text-sm font-bold hover:bg-green-700 transition whitespace-nowrap"
                  >
                    + Yaratish
                  </button>
                </div>
              </div>

              {/* PDF file field */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#143c7b]">
                  PDF fayl {isTeacher ? "*" : ""}
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  className="w-full bg-white border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  onChange={(e) => setPdfFile(e.target.files[0])}
                  required={isTeacher}
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

      {/* Create Author/Tag Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-[#143c7b] mb-4">
              {createModalType === "author" ? "Yangi muallif yaratish" : "Yangi teg yaratish"}
            </h3>
            <input
              type="text"
              placeholder={createModalType === "author" ? "Muallif nomi..." : "Teg nomi..."}
              className="w-full bg-white border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
              value={createModalValue}
              onChange={(e) => setCreateModalValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleCreateSubmit())}
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={handleCreateSubmit}
                disabled={createModalLoading || !createModalValue.trim()}
                className={`px-6 py-2.5 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition ${
                  createModalLoading || !createModalValue.trim() ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {createModalLoading ? "Yaratilmoqda..." : "Yaratish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}