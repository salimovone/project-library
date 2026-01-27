import { Link } from "react-router";

/**
 * NewArrivalCard Component
 * Responsibility: Render new arrival book card
 */
export default function NewArrivalCard({ book }) {
  return (
    <Link
      to={book.href}
      className="overflow-hidden rounded-2xl bg-white shadow-[0_6px_18px_rgba(0,0,0,0.08)] transition hover:-translate-y-1"
    >
      <img src={book.image} alt={book.title} className="h-52 w-full object-cover" />
      <div className="p-4">
        <h3 className="text-base font-semibold text-[#1a478e]">{book.title}</h3>
        <p className="text-sm text-gray-500">{book.author}</p>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {book.badges.map((badge) => (
              <span key={badge} className="h-6 w-6 rounded-md bg-[#edf2f7]" />
            ))}
          </div>
          <div className="flex items-center gap-1 text-sm font-semibold text-[#1a478e]">
            <span className="rounded-md bg-[#edf2f7] px-2 py-1">{book.rating}</span>
            <span className="text-red-500">★</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
