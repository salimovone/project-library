import { Link } from "react-router";
import { FaStar } from "react-icons/fa";

export default function MostReadCard({ book, rank = "01" }) {
  const imageUrl = book?.img || book?.cover_image || book?.cover;
  const bookTitle = book?.name || book?.title || "Kitob nomi";
  const bookAuthors = Array.isArray(book?.author)
    ? book.author.map((a) => (typeof a === "object" ? a.name || a.sortingname || "" : a)).filter(Boolean).join(", ")
    : typeof book?.author === "object"
    ? book.author.name || book.author.sortingname || "Noma'lum muallif"
    : book?.author || "Noma'lum muallif";
  const rawRating = book?.rating ?? book?.average_rating;
  const bookRating =
    typeof rawRating === "number"
      ? rawRating.toFixed(1)
      : rawRating
      ? String(rawRating)
      : "4.8";
  const bookReads = book?.view_count || book?.reads || "1 204";
  const formattedRank = typeof rank === "number" ? String(rank).padStart(2, "0") : rank;

  return (
    <Link
      to={`/books/${book?.id || 1}`}
      className="group flex gap-4 items-center bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl p-3.5 hover:border-[var(--border-strong)] hover:shadow-md transition-all duration-300 font-interface"
    >
      {/* Rank number */}
      <span className="w-8 font-editorial text-2.5xl font-normal text-[#c8c3b8] dark:text-[#5f7093] text-center shrink-0">
        {formattedRank}
      </span>

      {/* Cover thumbnail */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={bookTitle}
          className="w-[62px] h-[84px] rounded-xl object-cover shrink-0 shadow-xs group-hover:scale-105 transition-transform duration-300"
        />
      ) : (
        <span className="w-[62px] h-[84px] rounded-xl bg-gradient-to-br from-[#3d6cb0] to-[#22497f] shrink-0 relative overflow-hidden block">
          <span className="absolute left-0 top-0 bottom-0 w-1.2 bg-[var(--crimson-primary)]" />
        </span>
      )}

      {/* Details */}
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <span className="text-[14.5px] font-bold text-[var(--text-main)] leading-snug line-clamp-1">
          {bookTitle}
        </span>
        <span className="text-[12.5px] text-[var(--text-muted)] truncate">
          {bookAuthors}
        </span>
        <div className="flex items-center gap-2 mt-1">
          <span className="flex items-center gap-1 text-xs font-extrabold text-[var(--text-main)]">
            <FaStar className="text-[#e0a32e] text-[11px]" />
            {bookRating}
          </span>
          <span className="text-[11.5px] text-[var(--text-subtle)] font-semibold">
            · {bookReads} o'qildi
          </span>
        </div>
      </div>
    </Link>
  );
}