import { useState } from 'react';

export default function CreateModal({ type, onClose, onSubmit, isLoading }) {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit(value.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
        <h3 className="text-lg font-bold text-[#143c7b] mb-4">
          {type === "author" ? "Yangi muallif yaratish" : "Yangi teg yaratish"}
        </h3>
        <input
          type="text"
          placeholder={type === "author" ? "Muallif nomi..." : "Teg nomi..."}
          className="w-full bg-white border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleSubmit())}
          autoFocus
        />
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
          >
            Bekor qilish
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || !value.trim()}
            className={`px-6 py-2.5 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition ${
              isLoading || !value.trim() ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Yaratilmoqda..." : "Yaratish"}
          </button>
        </div>
      </div>
    </div>
  );
}
