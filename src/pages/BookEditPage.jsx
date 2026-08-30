import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
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
    subcategory_ids: [],
    quantity: "",
    tag_ids: [],
    description: "",
    pages: "",
    location: "",
    published_date: new Date().toISOString().split("T")[0],
  });

  const [pdfFile, setPdfFile] = useState(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createModalType, setCreateModalType] = useState("");
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

  useEffect(() => {
    const loadBookInfo = async () => {
      try {
        const bk = await fetchBook(id);
        if (bk) {
          setBookData({
            name: bk.name || "",
            author_ids: bk.author?.map((a) => a.id) || [],
            isbn: bk.isbn || "",
            category_id: bk.category?.id || "",
            subcategory_ids: bk.subcategories
              ? bk.subcategories.map((s) => s.id)
              : bk.subcategory
              ? [bk.subcategory.id]
              : [],
            quantity: bk.quantity || "",
            location: bk.location || "",
            tag_ids: bk.tags?.map((t) => t.id) || [],
            description: bk.description || "",
            pages: bk.pages || "",
            published_date: bk.published_date || new Date().toISOString().split("T")[0],
          });

          if (bk.author?.length || bk.tags?.length) {
            setOptions((prev) => {
              const newAuthors = [...prev.authors];
              const newTags = [...prev.tags];

              (bk.author || []).forEach((a) => {
                if (!newAuthors.find((existing) => existing.id === a.id)) newAuthors.push(a);
              });

              (bk.tags || []).forEach((t) => {
                if (!newTags.find((existing) => existing.id === t.id)) newTags.push(t);
              });

              return { ...prev, authors: newAuthors, tags: newTags };
            });
          }
        }
      } catch (e) {
        console.error("Book fetch error:", e);
      }
    };
    if (id) loadBookInfo();
  }, [id]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getMe();
        setUserData(data);
      } catch (e) {
        console.error("User error:", e);
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
        console.error("Options load error:", error);
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
      console.error("Author search error:", e);
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
      console.error("Tag search error:", e);
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
      console.error("Create error:", error);
      alert("Yaratishda xatolik yuz berdi");
    } finally {
      setCreateModalLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
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

      if (pdfFile) {
        formData.append("pdf", pdfFile);
      }
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
    <div className="p-6 md:p-8 font-interface flex flex-col gap-6 text-[var(--text-main)]">
      <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl p-6 shadow-xs flex flex-col gap-1">
        <h1 className="font-editorial text-2.5xl md:text-3xl font-normal text-[var(--text-main)]">
          Kitob ma'lumotlarini tahrirlash
        </h1>
        <span className="text-xs text-[var(--text-subtle)]">
          Kitob nashri va fayllariga o'zgartirishlar kiritish
        </span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl p-6 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-xs font-extrabold tracking-wider uppercase text-[var(--text-subtle)]">
              Kitob nomi *
            </label>
            <input
              name="name"
              type="text"
              value={bookData.name || ""}
              placeholder="Masalan: Odam anatomiyasi"
              className="w-full h-11 bg-[var(--bg-subtle)] border border-[var(--border-main)] rounded-xl px-4 text-sm font-semibold text-[var(--text-main)] outline-none focus:border-[var(--navy-primary)]"
              onChange={handleInputChange}
              required
            />
          </div>

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

          {isTeacher && userData && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold tracking-wider uppercase text-[var(--text-subtle)]">
                Muallif
              </label>
              <div className="h-11 bg-[var(--bg-subtle)] border border-[var(--border-main)] rounded-xl px-4 flex items-center text-sm font-semibold text-[var(--text-muted)]">
                {`${userData.first_name || ""} ${userData.last_name || ""}`.trim() || "O'qituvchi muallif"}
              </div>
            </div>
          )}

          <MultiSelectDropdown
            label="Adabiyot turi (Teglar)"
            placeholder="Teg qidirish..."
            createType="tag"
            selectedIds={bookData.tag_ids}
            items={options.tags}
            searchResults={searchOptions.tags}
            onSearchChange={handleTagSearch}
            onToggleItem={toggleTag}
            onOpenCreate={openCreateModal}
            colorTheme="green"
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-extrabold tracking-wider uppercase text-[var(--text-subtle)]">
              Kategoriya (Fakultet) *
            </label>
            <select
              name="category_id"
              value={bookData.category_id || ""}
              className="w-full h-11 bg-[var(--bg-subtle)] border border-[var(--border-main)] rounded-xl px-4 text-sm font-semibold text-[var(--text-main)] outline-none cursor-pointer"
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

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-extrabold tracking-wider uppercase text-[var(--text-subtle)]">
              Betlar soni *
            </label>
            <input
              name="pages"
              type="number"
              value={bookData.pages || ""}
              placeholder="Masalan: 444"
              className="w-full h-11 bg-[var(--bg-subtle)] border border-[var(--border-main)] rounded-xl px-4 text-sm font-semibold text-[var(--text-main)] outline-none focus:border-[var(--navy-primary)]"
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-extrabold tracking-wider uppercase text-[var(--text-subtle)]">
              Nusxalar soni *
            </label>
            <input
              name="quantity"
              type="number"
              min="0"
              value={bookData.quantity || ""}
              placeholder="Masalan: 24"
              className="w-full h-11 bg-[var(--bg-subtle)] border border-[var(--border-main)] rounded-xl px-4 text-sm font-semibold text-[var(--text-main)] outline-none focus:border-[var(--navy-primary)]"
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-extrabold tracking-wider uppercase text-[var(--text-subtle)]">
              ISBN / Inventor raqami
            </label>
            <input
              name="isbn"
              type="text"
              value={bookData.isbn || ""}
              placeholder="978-9943-00-123-4"
              className="w-full h-11 bg-[var(--bg-subtle)] border border-[var(--border-main)] rounded-xl px-4 text-sm font-semibold text-[var(--text-main)] outline-none focus:border-[var(--navy-primary)]"
              onChange={handleInputChange}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-extrabold tracking-wider uppercase text-[var(--text-subtle)]">
              Javon va xona raqami
            </label>
            <input
              name="location"
              type="text"
              value={bookData.location || ""}
              placeholder="3-xona, Javon 12"
              className="w-full h-11 bg-[var(--bg-subtle)] border border-[var(--border-main)] rounded-xl px-4 text-sm font-semibold text-[var(--text-main)] outline-none focus:border-[var(--navy-primary)]"
              onChange={handleInputChange}
            />
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-xs font-extrabold tracking-wider uppercase text-[var(--text-subtle)]">
              Annotatsiya va kitob haqida
            </label>
            <textarea
              name="description"
              rows="5"
              value={bookData.description || ""}
              placeholder="Kitob haqida ma'lumot kiritishingiz mumkin..."
              className="w-full p-4 bg-[var(--bg-subtle)] border border-[var(--border-main)] rounded-xl text-sm font-semibold text-[var(--text-main)] outline-none focus:border-[var(--navy-primary)] resize-none"
              onChange={handleInputChange}
            />
          </div>
        </div>

        <FileUploadTable
          imageFile={imageFile}
          setImageFile={setImageFile}
          pdfFile={pdfFile}
          setPdfFile={setPdfFile}
          isTeacher={isTeacher}
        />

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="h-12 px-8 rounded-xl bg-[var(--navy-primary)] text-white text-sm font-bold shadow-xs hover:opacity-90 transition cursor-pointer disabled:opacity-50"
          >
            {isLoading ? "Saqlanmoqda..." : "Kitobni o'zgartirish"}
          </button>
        </div>
      </form>

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