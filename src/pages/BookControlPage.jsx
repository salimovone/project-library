import React, { useState } from "react";
import { CgSearch } from "react-icons/cg";
import { FiUser, FiClock, FiCheckCircle, FiBookOpen, FiX } from "react-icons/fi";

export default function BookControlPage() {
  // Tab holatini boshqarish (1: Band qilingan, 2: Berilgan, 3: Qaytarilgan)
  const [activeTab, setActiveTab] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  // Modalni ochish funksiyasi
  const openModal = (book) => {
    setSelectedBook(book);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-20 font-sans text-[#143c7b]">
      {/* Breadcrumb */}
      <div className="bg-[#f2f4f7] py-3">
        <div className="custom-container mx-auto px-4 text-sm font-medium">
          Home / Book Control
        </div>
      </div>

      <div className="custom-container mx-auto px-4 mt-8 max-w-6xl">
        
        {/* TOP BAR: Qidiruv va Statistikalar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
          {/* Qidiruv */}
          <div className="relative w-full md:max-w-md">
            <input
              type="text"
              placeholder="Kitob yoki foydalanuvchi qidirish..."
              className="w-full bg-white border border-[#d1d9e6] rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm text-sm"
            />
            <CgSearch className="absolute left-4 top-3.5 text-xl text-gray-400" />
          </div>

          {/* Statistikalar */}
          <div className="flex gap-3 flex-wrap justify-center">
            <div className="flex items-center gap-2 bg-white border border-red-200 px-4 py-2 rounded-xl text-xs font-bold text-red-600 shadow-sm">
              <FiClock /> 2 band
            </div>
            <div className="flex items-center gap-2 bg-white border border-blue-200 px-4 py-2 rounded-xl text-xs font-bold text-[#143c7b] shadow-sm">
              <FiBookOpen /> 2 topshirilgan
            </div>
            <div className="flex items-center gap-2 bg-white border border-green-200 px-4 py-2 rounded-xl text-xs font-bold text-green-600 shadow-sm">
              <FiCheckCircle /> 2 qaytarilgan
            </div>
          </div>
        </div>

        {/* TABLAR */}
        <div className="bg-[#eef2f7] p-1.5 rounded-2xl inline-flex mb-8 border border-[#d1d9e6]">
          <button
            onClick={() => setActiveTab(1)}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition ${
              activeTab === 1 ? "bg-white shadow-md text-[#143c7b]" : "text-gray-500 hover:text-[#143c7b]"
            }`}
          >
            Band qilingan
          </button>
          <button
            onClick={() => setActiveTab(2)}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition ${
              activeTab === 2 ? "bg-white shadow-md text-[#143c7b]" : "text-gray-500 hover:text-[#143c7b]"
            }`}
          >
            Berilgan
          </button>
          <button
            onClick={() => setActiveTab(3)}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition ${
              activeTab === 3 ? "bg-white shadow-md text-[#143c7b]" : "text-gray-500 hover:text-[#143c7b]"
            }`}
          >
            Qaytarilgan
          </button>
        </div>

        {/* JADVAL QISMI */}
        <div className="bg-white border border-[#143c7b] rounded-3xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-5 text-sm font-bold border-b border-gray-100">Kitob</th>
                <th className="p-5 text-sm font-bold border-b border-gray-100">Foydalanuvchi</th>
                <th className="p-5 text-sm font-bold border-b border-gray-100">
                  {activeTab === 1 ? "Band sanasi" : "Topshirilgan"}
                </th>
                {activeTab !== 1 && (
                  <th className="p-5 text-sm font-bold border-b border-gray-100">
                    {activeTab === 2 ? "Muddat" : "Qaytarilgan"}
                  </th>
                )}
                <th className="p-5 text-sm font-bold border-b border-gray-100 text-center">Holat</th>
                <th className="p-5 text-sm font-bold border-b border-gray-100 text-center">Amal</th>
              </tr>
            </thead>
            <tbody>
              {/* NAMUNA QATORI */}
              <tr className="hover:bg-gray-50 transition border-b border-gray-50 last:border-none">
                <td className="p-5">
                  <div className="flex items-center gap-3">
                    <img src="https://via.placeholder.com/40x60" className="w-10 h-14 rounded-md object-cover" />
                    <div>
                      <div className="font-bold text-sm">Anor</div>
                      <div className="text-[11px] text-gray-500">Abdulla Qahhor</div>
                    </div>
                  </div>
                </td>
                <td className="p-5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                      <FiUser />
                    </div>
                    <span className="text-sm font-medium">Alisher Karimov</span>
                  </div>
                </td>
                <td className="p-5 text-sm text-[#5174ac]">2026-04-01</td>
                {activeTab !== 1 && <td className="p-5 text-sm text-[#5174ac]">2026-05-01</td>}
                <td className="p-5 text-center">
                  <span className="px-4 py-1.5 border border-blue-200 rounded-lg text-[11px] font-bold text-[#143c7b]">
                    {activeTab === 1 ? "Band qilingan" : activeTab === 2 ? "Topshirilgan" : "Qaytarilgan"}
                  </span>
                </td>
                <td className="p-5 text-center">
                  {activeTab === 1 && (
                    <button 
                      onClick={() => openModal({name: 'Anor', author: 'Abdulla Qahhor', user: 'Alisher Karimov'})}
                      className="bg-[#003282] text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-blue-900 transition flex items-center gap-2 mx-auto"
                    >
                      <FiBookOpen /> Topshirish
                    </button>
                  )}
                  {activeTab === 2 && (
                    <button className="border border-[#003282] text-[#003282] px-5 py-2 rounded-lg text-xs font-bold hover:bg-blue-50 transition flex items-center gap-2 mx-auto">
                      <FiCheckCircle /> Qabul qilish
                    </button>
                  )}
                  {activeTab === 3 && <span className="text-xs text-gray-400">Yopilgan</span>}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Kitobni topshirish */}
      {showModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-[#0009] bg-opacity-40 p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl relative">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute right-6 top-6 text-gray-400 hover:text-red-500 transition"
            >
              <FiX className="text-xl" />
            </button>

            <h2 className="text-xl font-bold text-[#143c7b] mb-2 text-center lg:text-left">Kitobni topshirish</h2>
            <p className="text-sm text-gray-500 mb-6 text-center lg:text-left">
              Kitobni foydalanuvchiga topshirish va qaytarish muddatini belgilang.
            </p>

            {/* Tanlangan kitob kartasi */}
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex items-center gap-4 mb-6">
               <img src="https://via.placeholder.com/40x60" className="w-12 h-18 rounded-lg object-cover shadow-sm" />
               <div>
                  <div className="font-bold text-sm">{selectedBook?.name}</div>
                  <div className="text-xs text-gray-400">{selectedBook?.author}</div>
                  <div className="mt-1 flex items-center gap-1 text-[10px] text-gray-400 font-medium">
                    <FiUser /> {selectedBook?.user}
                  </div>
               </div>
            </div>

            {/* Qaytarish muddati */}
            <div className="space-y-2 mb-8">
              <label className="text-xs font-bold">Qaytarish muddati *</label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full bg-[#f8f9fa] border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            {/* Modal tugmalari */}
            <div className="flex gap-4">
              <button 
                onClick={() => setShowModal(false)}
                className="flex-1 bg-white border border-gray-200 text-gray-500 py-3 rounded-xl text-sm font-bold hover:bg-gray-50 transition"
              >
                Bekor qilish
              </button>
              <button className="flex-1 bg-[#003282] text-white py-3 rounded-xl text-sm font-bold hover:bg-blue-900 shadow-lg transition flex items-center justify-center gap-2">
                <FiBookOpen /> Topshirish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}