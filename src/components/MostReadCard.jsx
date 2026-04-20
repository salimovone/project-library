import { Link } from "react-router";

export default function MostReadCard({ book }) {
  const imageUrl = book.img;

  const icons = [];

  if (book.is_physical) {
    icons.push(
      <svg key="phys" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5 text-[#1a56db]">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    );
  }

  if (book.has_audio) {
    icons.push(
      <svg key="audio" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5 text-[#e02424]">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6" /><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
      </svg>
    );
  }

  if (book.has_pdf) {
    icons.push(
      <svg key="pdf" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5 text-[#ff7b42]">
        <rect width="16" height="20" x="4" y="2" rx="2" ry="2" /><line x1="12" x2="12.01" y1="18" y2="18" />
      </svg>
    );
  }

  return (
    <Link
      to={`/books/${book.id}`}
      className="group flex items-center gap-5 rounded-3xl bg-[#f5f5f5] p-3.5 transition-all duration-300 hover:shadow-md hover:-translate-y-1"
    >
      {/* Kitob rasmi - rasmga mos aspect va radius */}
      <div className="h-30 w-22.5 shrink-0 overflow-hidden rounded-2xl shadow-sm relative">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={book?.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="h-full w-full bg-linear-to-br from-[#003366] to-[#1a478e] p-1.5 flex flex-col items-center justify-center text-center relative transition-transform duration-500 group-hover:scale-110">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-pulse"></div>
            <h3 className="text-[10px] font-bold text-white line-clamp-3 leading-tight relative z-10 px-0.5">{book?.name}</h3>
          </div>
        )}
      </div>

      {/* Ma'lumotlar qismi */}
      <div className="flex flex-col justify-between py-1 h-full">
        <div>
          <h3 className="text-[16px] font-bold text-[#143c7b] leading-tight line-clamp-2 mb-1">
            {book?.name}
          </h3>

          <div className="flex flex-wrap gap-x-1">
            {book.author && book.author.map((data, idx) => (
              <p key={idx + 1} className="text-[13px] font-medium text-[#64748b]">
                {data?.name}{idx < book.author.length - 1 ? "," : ""}
              </p>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            {icons.map((icon, index) => (
              <div key={index} className="flex items-center gap-2">
                {icon}
                {index < icons.length - 1 && (
                  <div className="h-3 w-[1.5px] bg-gray-300 rounded-full" />
                )}
              </div>
            ))}
          </div>

          {/* Reyting qismi - 0 bo'lsa 0.0 ko'rsatadi */}
          <div className="flex items-center gap-1.5 rounded-lg bg-white px-2 py-1 shadow-sm border border-gray-50">
            <span className="text-[14px] font-black text-[#143c7b]">
              {book.rating?.toFixed(1) || "0.0"}
            </span>
            <span className="text-[#ef4444] text-xs">★</span>
          </div>
        </div>
      </div>
    </Link>
  );
}