import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router";
import { fetchCategories, fetchSubcategories, fetchTags } from "../services/additional";
import { getAuthors, createAuthor, createTag, createBook } from "../services/bookService";
import { getMe } from "../services/userService";
import useRole from "../hooks/useRole";
import { useNotification } from "../context/NotificationContext";

import MultiSelectDropdown from "../components/BookCreate/MultiSelectDropdown";
import FileUploadTable from "../components/BookCreate/FileUploadTable";
import CreateModal from "../components/BookCreate/CreateModal";

export default function BookCreatePage() {
  const navigate = useNavigate();
  const { role } = useRole();
  const isTeacher = role === "teacher";
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const { showNotification } = useNotification();

  const [bookData, setBookData] = useState({
    name: "",
    author_ids: [],
    isbn: "",
    category_id: "",
    subcategory_ids: [],
    quantity: "",
    tag_ids: [],
    description: "",
    pages: "",
    location: "",
    published_date: new Date().toISOString().split("T")[0],
  });

  const [pdfFile, setPdfFile] = useState(null);

  // Create modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createModalType, setCreateModalType] = useState(""); // "author" or "tag"
  const [createModalLoading, setCreateModalLoading] = useState(false);
  const [createModalInitialValue, setCreateModalInitialValue] = useState("");

  const [options, setOptions] = useState({
    categories: [],
    subcategories: [],
    authors: [],
    tags: [],
  });

  const [searchOptions, setSearchOptions] = useState({
    authors: [],
    tags: [],
  });

  const [imageFile, setImageFile] = useState(null);

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

        setSearchOptions({
          authors: authRes || [],
          tags: tagsRes || [],
        });
      } catch (error) {
        console.error("Ma'lumotlarni yuklashda xatolik:", error);
      }
    };

    fetchOptions();
  }, []);

  const handleAuthorSearch = useCallback(async (searchValue) => {
    try {
      const res = await getAuthors(searchValue);
      setSearchOptions((prev) => ({ ...prev, authors: res || [] }));
      setOptions((prev) => {
        const newAuthors = [...prev.authors];
        (res || []).forEach((item) => {
          if (!newAuthors.find((a) => a.id === item.id)) newAuthors.push(item);
        });
        return { ...prev, authors: newAuthors };
      });
    } catch (e) {
      console.error("Avtorlarni qidirishda xatolik:", e);
    }
  }, []);

  const handleTagSearch = useCallback(async (searchValue) => {
    try {
      const res = await fetchTags(searchValue);
      setSearchOptions((prev) => ({ ...prev, tags: res || [] }));
      setOptions((prev) => {
        const newTags = [...prev.tags];
        (res || []).forEach((item) => {
          if (!newTags.find((t) => t.id === item.id)) newTags.push(item);
        });
        return { ...prev, tags: newTags };
      });
    } catch (e) {
      console.error("Teglarni qidirishda xatolik:", e);
    }
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

  const toggleSubcategory = (subcategoryId) => {
    setBookData((prev) => {
      const ids = prev.subcategory_ids.includes(subcategoryId)
        ? prev.subcategory_ids.filter((id) => id !== subcategoryId)
        : [...prev.subcategory_ids, subcategoryId];
      return { ...prev, subcategory_ids: ids };
    });
  };

  const openCreateModal = (type, initialValue = "") => {
    setCreateModalType(type);
    setCreateModalInitialValue(initialValue);
    setShowCreateModal(true);
  };

  const handleCreateSubmit = async (value) => {
    setCreateModalLoading(true);
    try {
      if (createModalType === "author") {
        const newAuthor = await createAuthor(value);
        setOptions((prev) => ({ ...prev, authors: [...prev.authors, newAuthor] }));
        setSearchOptions((prev) => ({ ...prev, authors: [...prev.authors, newAuthor] }));
        setBookData((prev) => ({ ...prev, author_ids: [...prev.author_ids, newAuthor.id] }));
      } else {
        const newTag = await createTag(value);
        setOptions((prev) => ({ ...prev, tags: [...prev.tags, newTag] }));
        setSearchOptions((prev) => ({ ...prev, tags: [...prev.tags, newTag] }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (isTeacher && !pdfFile) {
      alert("Iltimos, PDF faylni yuklang!");
      setIsLoading(false);
      return;
    }

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
      formData.append("location", bookData.location || "");

      const tagIds = bookData.tag_ids.length > 0 ? bookData.tag_ids.map(Number) : [0];
      const finalAuthorIds = authorIds.length > 0 ? authorIds.map(Number) : [0];
      const subcatIds = bookData.subcategory_ids.length > 0 ? bookData.subcategory_ids.map(Number) : [0];
      
      tagIds.forEach((id) => formData.append("tag_ids", id));
      finalAuthorIds.forEach((id) => formData.append("author_ids", id));
      subcatIds.forEach((id) => formData.append("subcategory_ids", id));

      // PDF fayl
      if (pdfFile) {
        formData.append("pdf", pdfFile);
      }

      // Rasm
      if (imageFile) {
        formData.append("img", imageFile);
      }

      await createBook(formData);

      // Reset form fields
      setBookData({
        name: "",
        author_ids: [],
        isbn: "",
        category_id: "",
        subcategory_ids: [],
        quantity: "",
        tag_ids: [],
        description: "",
        pages: "",
        location: "",
        published_date: new Date().toISOString().split("T")[0],
      });
      setImageFile(null);
      setPdfFile(null);

      // Show success notification
      showNotification("Kitob muvaffaqiyatli saqlandi!", "success");

    } catch (error) {
      console.error("Xatolik:", error);
      alert(error.message || "Saqlashda xatolik yuz berdi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] pb-20 font-sans transition-colors duration-300">
      <div className="bg-[#f2f4f7] dark:bg-[#1a1a1a] py-3 transition-colors duration-300">
        <div className="custom-container mx-auto px-4 text-sm font-medium text-[#143c7b] dark:text-blue-300 transition-colors">
          <Link to="/">Home</Link> / Book Create
        </div>
      </div>

      <div className="custom-container mx-auto px-4 mt-8">
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-8">

          <div className="bg-[#f6f8fa] dark:bg-[#1e1e1e] border border-[#d1d9e6] dark:border-gray-800 rounded-3xl p-8 shadow-sm transition-colors duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Kitob nomi */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-bold text-[#143c7b] dark:text-blue-300 transition-colors">Kitob nomi *</label>
                <input
                  name="name"
                  type="text"
                  value={bookData.name}
                  placeholder="Kitob nomi kiriting ...."
                  className="w-full bg-white dark:bg-[#252525] border border-gray-300 dark:border-gray-700 rounded-xl py-3 px-4 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Mualliflar */}
              {!isTeacher && (
                <MultiSelectDropdown
                  label="Mualliflar *"
                  placeholder="Muallif qidirish..."
                  createType="author"
                  selectedIds={bookData.author_ids}
                  items={options.authors}
                  searchResults={searchOptions.authors}
                  onSearchChange={handleAuthorSearch}
                  onToggleItem={toggleAuthor}
                  onOpenCreate={openCreateModal}
                  colorTheme="blue"
                />
              )}

              {/* Teacher info notice */}
              {isTeacher && userData && (
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-[#143c7b] dark:text-blue-300 transition-colors">Muallif</label>
                  <div className="w-full bg-gray-100 dark:bg-[#2a2a2a] border border-gray-300 dark:border-gray-700 rounded-xl py-3 px-4 text-gray-600 dark:text-gray-300 transition-colors">
                    {`${userData.first_name || ""} ${userData.last_name || ""}`.trim() || "Avtomatik to'ldiriladi"}
                  </div>
                </div>
              )}

              {/* Teglar */}
              <MultiSelectDropdown
                label="Adabyot turi"
                placeholder="Adabyot turi qidirish..."
                createType="tag"
                selectedIds={bookData.tag_ids}
                items={options.tags}
                searchResults={searchOptions.tags}
                onSearchChange={handleTagSearch}
                onToggleItem={toggleTag}
                onOpenCreate={openCreateModal}
                colorTheme="green"
              />

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#143c7b] dark:text-blue-300 transition-colors">Fakultetni tanlash *</label>
                <select
                  name="category_id"
                  value={bookData.category_id}
                  className="w-full bg-white dark:bg-[#252525] border border-gray-300 dark:border-gray-700 rounded-xl py-3 px-4 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Fakultetni tanlang</option>
                  {options.categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <MultiSelectDropdown
                label="Yo'nalishlar *"
                placeholder="Yo'nalish qidirish..."
                selectedIds={bookData.subcategory_ids}
                items={options.subcategories}
                onToggleItem={toggleSubcategory}
                colorTheme="blue"
              />

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#143c7b] dark:text-blue-300 transition-colors">Sahifalar soni *</label>
                <input
                  name="pages"
                  type="number"
                  value={bookData.pages}
                  placeholder="Sahifalar sonini kiriting ...."
                  className="w-full bg-white dark:bg-[#252525] border border-gray-300 dark:border-gray-700 rounded-xl py-3 px-4 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#143c7b] dark:text-blue-300 transition-colors">Kitob soni *</label>
                <input
                  name="quantity"
                  type="number"
                  min="0"
                  value={bookData.quantity}
                  placeholder="Kitob sonini kiriting ...."
                  className="w-full bg-white dark:bg-[#252525] border border-gray-300 dark:border-gray-700 rounded-xl py-3 px-4 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* ISBN will be next to Joylashuv */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#143c7b] dark:text-blue-300 transition-colors">Inventor raqam</label>
                <input
                  name="isbn"
                  type="text"
                  value={bookData.isbn}
                  placeholder="Inventor raqam kiriting ...."
                  className="w-full bg-white dark:bg-[#252525] border border-gray-300 dark:border-gray-700 rounded-xl py-3 px-4 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#143c7b] dark:text-blue-300 transition-colors">Javon raqami</label>
                <input
                  name="location"
                  type="text"
                  value={bookData.location}
                  placeholder="Javon raqamini kiriting ...."
                  className="w-full bg-white dark:bg-[#252525] border border-gray-300 dark:border-gray-700 rounded-xl py-3 px-4 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                  onChange={handleInputChange}
                />
              </div>


            </div>

            <div className="mt-6 space-y-1.5">
              <label className="text-sm font-bold text-[#143c7b] dark:text-blue-300 transition-colors">Kitobning to'liq shakli</label>
              <textarea
                name="description"
                rows="6"
                value={bookData.description}
                placeholder="Kitob haqida kiriting ...."
                className="w-full bg-white dark:bg-[#252525] border border-gray-300 dark:border-gray-700 rounded-xl py-3 px-4 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none transition-colors"
                onChange={handleInputChange}
              />
              <div className="mt-3 p-4 rounded-xl bg-[#f0f4f8] dark:bg-[#2a2a2a] border-l-4 border-l-[#143c7b] dark:border-l-blue-500 border border-[#d1d9e6] dark:border-gray-700 text-[13.5px] text-[#143c7b] dark:text-blue-300 leading-relaxed shadow-sm transition-colors">
                <span className="font-bold block mb-1">Namuna:</span>
                A.G’. Ahmedov, Odam anatomiyasi: Tibbiyot institutlarining bakalavriat yo’nalishidagi talabalari uchun darslik / A.G’.Ahmedov; O’zbekiston Reaspublikasi Oliy va o’rta maxsus ta’lim vazirligi, O’zbekiston Respublikasi sog’liqni saqlash vazirligi. -T.: “IQTISOD-MOLIYA”, 2007. 444b
              </div>
            </div>
          </div>

          <FileUploadTable
            imageFile={imageFile}
            setImageFile={setImageFile}
            pdfFile={pdfFile}
            setPdfFile={setPdfFile}
            isTeacher={isTeacher}
          />

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`bg-[#003282] dark:bg-blue-600 text-white px-12 py-3.5 rounded-xl font-bold transition shadow-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-900 dark:hover:bg-blue-500'}`}
            >
              {isLoading ? "Saqlanmoqda..." : "Kitobni saqlash"}
            </button>
          </div>
        </form>
      </div>

      {showCreateModal && (
        <CreateModal
          type={createModalType}
          initialValue={createModalInitialValue}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateSubmit}
          isLoading={createModalLoading}
        />
      )}
    </div>
  );
}