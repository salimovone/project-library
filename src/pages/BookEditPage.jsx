import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Link, useNavigate } from "react-router";
import { fetchCategories, fetchSubcategories, fetchTags } from "../services/additional";
import { getAuthors, createAuthor, createTag, patchBook, fetchBook } from "../services/bookService";
import { getMe } from "../services/userService";
import useRole from "../hooks/useRole";

import MultiSelectDropdown from "../components/BookCreate/MultiSelectDropdown";
import FileUploadTable from "../components/BookCreate/FileUploadTable";
import CreateModal from "../components/BookCreate/CreateModal";

export default function BookEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { role } = useRole();
  const isTeacher = role === "teacher";
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
    location: "",
    published_date: new Date().toISOString().split("T")[0],
  });

  const [pdfFile, setPdfFile] = useState(null);

  // Create modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createModalType, setCreateModalType] = useState(""); // "author" or "tag"
  const [createModalLoading, setCreateModalLoading] = useState(false);

  const [options, setOptions] = useState({
    categories: [],
    subcategories: [],
    authors: [],
    tags: [],
  });

  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const loadBookInfo = async () => {
      try {
        const bookResp = await fetchBook(id);
        const bk = bookResp; // The fetchBook service returns raw data response directly, or maybe res.data. Let's assume bk is the object because other code accessed bk.id directly.
        setBookData({
          name: bk.name || "",
          author_ids: bk.author?.map(a => a.id) || [],
          isbn: bk.isbn || "",
          category_id: bk.category?.id || "",
          subcategory_id: bk.subcategory?.id || "",
          quantity: bk.quantity || "",
          location: bk.location || "",
          tag_ids: bk.tags?.map(t => t.id) || [],
          description: bk.description || "",
          pages: bk.pages || "",
          published_date: bk.published_date || new Date().toISOString().split("T")[0],
        });
      } catch (e) {
        console.error("Kitobni yuklashda xatolik:", e);
      }
    };
    if (id) loadBookInfo();
  }, [id]);

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

  const openCreateModal = (type) => {
    setCreateModalType(type);
    setShowCreateModal(true);
  };

  const handleCreateSubmit = async (value) => {
    setCreateModalLoading(true);
    try {
      if (createModalType === "author") {
        const newAuthor = await createAuthor(value);
        setOptions((prev) => ({ ...prev, authors: [...prev.authors, newAuthor] }));
        setBookData((prev) => ({ ...prev, author_ids: [...prev.author_ids, newAuthor.id] }));
      } else {
        const newTag = await createTag(value);
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
      formData.append("location", bookData.location || "");

      const tagIds = bookData.tag_ids.length > 0 ? bookData.tag_ids.map(Number) : [0];
      const finalAuthorIds = authorIds.length > 0 ? authorIds.map(Number) : [0];
      tagIds.forEach((id) => formData.append("tag_ids", id));
      finalAuthorIds.forEach((id) => formData.append("author_ids", id));

      // PDF fayl
      if (pdfFile) {
        formData.append("pdf", pdfFile);
      }

      // Rasm
      if (imageFile) {
        formData.append("img", imageFile);
      }

      await patchBook(id, formData);

      navigate(`/books/${id}`);

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
          <Link to="/">Home</Link> / Book Edit
        </div>
      </div>

      <div className="custom-container mx-auto px-4 mt-8">
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-8">

          <div className="bg-[#f6f8fa] border border-[#d1d9e6] rounded-3xl p-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Kitob nomi */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-bold text-[#143c7b]">Kitob nomi *</label>
                <input
                  name="name"
                  type="text"
                  value={bookData.name || ""}
                  placeholder="Kitob nomi kiriting ...."
                  className="w-full bg-white border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                  onToggleItem={toggleAuthor}
                  onOpenCreate={openCreateModal}
                  colorTheme="blue"
                />
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

              {/* Teglar */}
              <MultiSelectDropdown
                label="Teglar"
                placeholder="Teg qidirish..."
                createType="tag"
                selectedIds={bookData.tag_ids}
                items={options.tags}
                onToggleItem={toggleTag}
                onOpenCreate={openCreateModal}
                colorTheme="green"
              />

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#143c7b]">Kategoriya *</label>
                <select
                  name="category_id"
                  value={bookData.category_id || ""}
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
                  value={bookData.subcategory_id || ""}
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
                  value={bookData.pages || ""}
                  placeholder="Sahifalar sonini kiriting ...."
                  className="w-full bg-white border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#143c7b]">Kitob soni *</label>
                <input
                  name="quantity"
                  type="number"
                  min="1"
                  value={bookData.quantity || ""}
                  placeholder="Kitob sonini kiriting ...."
                  className="w-full bg-white border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* ISBN will be next to Joylashuv */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#143c7b]">ISBN *</label>
                <input
                  name="isbn"
                  type="text"
                  value={bookData.isbn || ""}
                  placeholder="Kitob isbn kiriting ...."
                  className="w-full bg-white border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#143c7b]">Joylashuv</label>
                <input
                  name="location"
                  type="text"
                  value={bookData.location || ""}
                  placeholder="Joylashuvni kiriting ...."
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
                value={bookData.description || ""}
                placeholder="Kitob haqida kiriting ...."
                className="w-full bg-white border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                onChange={handleInputChange}
              />
              <div className="mt-3 p-4 rounded-xl bg-[#f0f4f8] border-l-4 border-l-[#143c7b] border border-[#d1d9e6] text-[13.5px] text-[#143c7b] leading-relaxed shadow-sm">
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
              className={`bg-[#003282] text-white px-12 py-3.5 rounded-xl font-bold transition shadow-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-900'}`}
            >
              {isLoading ? "Saqlanmoqda..." : "Kitobni o'zgartirish"}
            </button>
          </div>
        </form>
      </div>

      {showCreateModal && (
        <CreateModal
          type={createModalType}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateSubmit}
          isLoading={createModalLoading}
        />
      )}
    </div>
  );
}