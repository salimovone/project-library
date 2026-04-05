import React, { useState } from "react";
import { Link } from "react-router";

export default function BookCreatePage() {
  // Asosiy ma'lumotlar state'i
  const [bookData, setBookData] = useState({
    name: "",
    author: "",
    isbn: "",
    genre: "",
    quantity: "",
    tags: "",
    description: "",
  });

  // Dinamik rasmlar ro'yxati state'i
  const [images, setImages] = useState([
    { id: Date.now(), file: null, order: "" },
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookData((prev) => ({ ...prev, [name]: value }));
  };

  // Yangi rasm qatori qo'shish
  const addImageRow = () => {
    setImages([...images, { id: Date.now(), file: null, order: "" }]);
  };

  // Rasm qatorini o'chirish
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // API ga yuborish logikasi shu yerda bo'ladi
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
              {/* Kitob nomi */}
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
              {/* Muallifi */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#143c7b]">Muallifi *</label>
                <input
                  name="author"
                  type="text"
                  placeholder="Kitob muallifini kiriting ...."
                  className="w-full bg-white border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  onChange={handleInputChange}
                  required
                />
              </div>
              {/* ISBN */}
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
              {/* Janri */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#143c7b]">Janri *</label>
                <input
                  name="genre"
                  type="text"
                  placeholder="Kitob janrini kiriting ...."
                  className="w-full bg-white border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  onChange={handleInputChange}
                  required
                />
              </div>
              {/* Miqdori */}
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
              {/* Taglar */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#143c7b]">Taglar</label>
                <input
                  name="tags"
                  type="text"
                  placeholder="Kitob taglarini kiriting ...."
                  className="w-full bg-white border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  onChange={handleInputChange}
                />
              </div>
            </div>
            {/* Tavsifi */}
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
              className="bg-[#003282] text-white px-12 py-3.5 rounded-xl font-bold hover:bg-blue-900 transition shadow-lg"
            >
              Kitobni saqlash
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}