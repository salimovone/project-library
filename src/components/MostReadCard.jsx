import { Link } from "react-router";

/**
 * MostReadCard Component
 * Responsibility: Render most read book card
 */
export default function MostReadCard({ book }) {
  return (
    <Link
      to={book.href}
      className="flex gap-4 rounded-2xl bg-white p-4 shadow-[0_6px_18px_rgba(0,0,0,0.08)] transition hover:-translate-y-1"
    >
      <img src={book.image} alt={book.title} className="h-24 w-20 rounded-xl object-cover" />
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[#1a478e]">{book.title}</h3>
          <p className="text-xs text-gray-500">{book.author}</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          {book.badges.map((badge, idx) => (
            <span key={idx+1} className="h-5 w-5 rounded bg-[#edf2f7]" />
          ))}
          <span className="ml-auto flex items-center gap-1 text-sm font-semibold text-[#1a478e]">
            {book.rating}
            <span className="text-red-500">★</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
