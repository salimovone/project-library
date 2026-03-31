import { Link } from "react-router";

/**
 * MostReadCard Component
 * Responsibility: Render most read book card based on the provided design
 */
export default function MostReadCard({ book }) {
  const imageUrl = book.img;

  return (
    <Link
      to={`/books/${book.id}`}
      // Orqa fonni biroz to'qroq qildik (bg-gray-100), ajralib turishi uchun
      className="flex items-center gap-5 rounded-2xl bg-gray-100 p-3 transition hover:-translate-y-1"
    >
      {/* Kitob rasmi */}
      <img
        src={imageUrl}
        alt={book?.name}
        className="h-45 w-32.5 shrink-0 rounded-[14px] object-cover shadow-sm"
      />

      {/* Ma'lumotlar qismi */}
      <div className="flex flex-col">
        {/* Kitob nomi */}
        <h3 className="text-lg font-bold text-[#143c7b] leading-tight line-clamp-2">
          {book?.name}
        </h3>

        {/* Muallif */}
        {book.author.map((data, idx) => (
          <p
            key={idx + 1}
            className="mt-1 text-sm font-medium text-[#5174ac] line-clamp-1"
          >
            {data?.name}
          </p>
        ))}

        {/* Ikonalar va Reyting qatori */}
        <div className="mt-4">
          {/* Format ikonalari (Bir xil qalinlikdagi Outline ikonalar) */}
          <div className="flex items-center gap-2">
            {/* Kitob ikonasi (Ko'k) */}
            {book.is_physical && (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4.5 w-4.5 text-[#1a56db]"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
            )}
            {/* Vertikal chiziq ajratgich */}

            {/* Quloqchin ikonasi (Qizil) */}
            <div className="h-3 w-[1.5px] bg-gray-300 rounded-full"></div>
            {book.has_audio && (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4.5 w-4.5 text-[#e02424]"
            >
              <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
              <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
            </svg>
            )}
            {/* Vertikal chiziq ajratgich */}
            <div className="h-3 w-[1.5px] bg-gray-300 rounded-full"></div>

            {/* Planshet/Ekran ikonasi (Olovrang) */}
            {book.has_pdf && (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4.5 w-4.5 text-[#ff7b42]"
            >
              <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
              <line x1="12" x2="12.01" y1="18" y2="18" />
            </svg>
            )}
          </div>

          {/* Reyting va Yulduz */}
          <div className="flex items-center gap-1 text-[15px] font-bold text-[#143c7b] ml-1">
            <span>{book.rating}</span>
            <span className="text-[#e02424] text-sm">★</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
