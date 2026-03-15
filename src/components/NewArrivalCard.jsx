import { Link } from "react-router"; // react-router dan import qilinishi kerak

/**
 * NewArrivalCard Component
 * Responsibility: Render new arrival book card with dynamic data
 */
export default function NewArrivalCard({ book }) {
  // Datada rasm yo'qligi sababli, rasm kelsa o'zini, kelmasa default rasmni qo'yadi
  const fallbackImg = "https://via.placeholder.com/300x450?text=Kitob+Muqovasi";
  const imageUrl = book.img ? book.img : fallbackImg;

  return (
    <Link
      to={`/books/${book.id}`}
      className="flex flex-col h-full overflow-hidden rounded-2xl bg-white shadow-[0_6px_18px_rgba(0,0,0,0.08)] transition hover:-translate-y-1"
    >
      {/* Rasm qismi: aspect-[2/3] klassi orqali eni va bo'yi proportsiyasi saqlanadi */}
      <div className="w-full aspect-4/5 overflow-hidden bg-gray-100">
        <img 
          src={imageUrl} 
          alt={book.name} 
          className="h-full w-full object-cover" 
        />
      </div>

      <div className="flex flex-col grow p-4">
        {/* Kitob nomi va avtori */}
        <h3 className="text-base font-semibold text-[#1a478e] line-clamp-1" title={book.name}>
          {book.name}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-1">{book.author}</p>

        {/* Teglar va reyting (mt-auto orqali doim eng pastga yopishib turadi) */}
        <div className="mt-auto pt-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Teglarni chiqarish. Dizayn buzilmasligi uchun maksimum 2-3 tasini chiqargan ma'qul */}
            {book.tags?.slice(0, 2).map((tag) => (
              <span 
                key={tag.id} 
                className="rounded-md bg-[#edf2f7] px-2 py-0.5 text-[11px] font-medium text-gray-600"
              >
                {tag.name}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-1 shrink-0 text-sm font-semibold text-[#1a478e]">
            <span className="rounded-md bg-[#edf2f7] px-2 py-1">{book.rating}</span>
            <span className="text-red-500">★</span>
          </div>
        </div>
      </div>
    </Link>
  );
}