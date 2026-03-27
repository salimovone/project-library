import { FaStar } from "react-icons/fa";

export default function BookDetailsPanel({ book }) {
  // Sanani chiroyli formatlash
  const pubDate = book.c_at
    ? new Date(book.c_at).toLocaleDateString("uz-UZ", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Mavjud emas";

  const normalizedRating =
    book.rating > 5 ? (book.rating / 2).toFixed(1) : book.rating;

  return (
    <div className="rounded-2xl bg-white p-6 md:p-8 max-lg:mt-16 shadow-[0_6px_20px_rgba(0,0,0,0.08)]">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1a478e] leading-tight">
            {book?.name}
          </h1>
          {book.author &&
            book.author.length &&
            book.author.map((author, idx) => (
              <p key={idx + 1} className="text-base text-gray-500 mt-1 font-medium">
                by {author.name}
              </p>
            ))}
        </div>

        {/* Omborda bor/yo'qligi */}
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${
            book.quantity > 0
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {book.quantity > 0 ? `Omborda: ${book.quantity} ta` : "Qolmagan"}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
        <div className="flex text-yellow-500">
          {Array.from({ length: 5 }).map((_, index) => (
            <FaStar
              key={index}
              className={
                index < Math.floor(normalizedRating)
                  ? "text-yellow-400"
                  : "text-gray-300"
              }
            />
          ))}
        </div>
        <span className="font-bold text-[#1a478e] text-base">
          {normalizedRating}
        </span>
        <span>({book.is_frequent ? "Ko'p o'qilgan" : "Yangi"})</span>
      </div>

      {/* Detallar Jadvali */}
      <div className="mt-8 border-t border-gray-100 pt-6">
        <h2 className="text-base font-bold text-[#143c7b] mb-4">
          Kitob tafsilotlari
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm text-gray-600 bg-gray-50 p-4 rounded-xl">
          <div className="flex justify-between sm:block border-b sm:border-none border-gray-200 pb-2 sm:pb-0">
            <p className="text-gray-500 mb-1">Kategoriya:</p>
            <p className="font-semibold text-gray-800 capitalize">
              {book.category?.name || "N/A"}
            </p>
          </div>
          <div className="flex justify-between sm:block border-b sm:border-none border-gray-200 pb-2 sm:pb-0">
            <p className="text-gray-500 mb-1">ISBN:</p>
            <p className="font-semibold text-gray-800">{book.isbn || "N/A"}</p>
          </div>
          <div className="flex justify-between sm:block border-b sm:border-none border-gray-200 pb-2 sm:pb-0">
            <p className="text-gray-500 mb-1">Nashr sanasi:</p>
            <p className="font-semibold text-gray-800">{pubDate}</p>
          </div>
          <div className="flex justify-between sm:block">
            <p className="text-gray-500 mb-1">Kitobxon:</p>
            <p className="font-semibold text-gray-800">
              {book.reader?.first_name} {book.reader?.last_name}
            </p>
          </div>
        </div>
      </div>

      {/* Description / About */}
      <div className="mt-8 border-t border-gray-100 pt-6">
        <h2 className="text-base font-bold text-[#143c7b] mb-3">
          Kitob haqida
        </h2>
        <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
          {book.description || "Ma'lumot kiritilmagan..."}
        </div>

        {/* Teglar */}
        {book.tags && book.tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {book.tags.map((tag) => (
              <span
                key={tag.id}
                className="rounded-md bg-[#edf2f7] px-3 py-1.5 text-xs font-semibold text-[#1a478e] capitalize hover:bg-blue-100 cursor-pointer transition"
              >
                #{tag?.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
