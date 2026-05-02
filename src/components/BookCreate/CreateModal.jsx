import { useState } from 'react';

export default function CreateModal({ type, onClose, onSubmit, isLoading, initialValue = "" }) {
  const [value, setValue] = useState(initialValue);

  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit(value.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 transition-colors duration-300">
        <h3 className="text-lg font-bold text-[#143c7b] dark:text-blue-300 mb-4 transition-colors">
          {type === "author" ? "Yangi muallif yaratish" : "Yangi teg yaratish"}
        </h3>
        <input
          type="text"
          placeholder={type === "author" ? "Muallif nomi..." : "Teg nomi..."}
          className="w-full bg-white dark:bg-[#252525] border border-gray-300 dark:border-gray-700 rounded-xl py-3 px-4 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6 transition-colors"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleSubmit())}
          autoFocus
        />
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors"
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
