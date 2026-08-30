import { FaStar } from "react-icons/fa";

export default function BookDetailsPanel({ book, commentCount }) {
  const pubDate =
    book?.published_date &&
    new Date(book.published_date).toLocaleDateString("uz-UZ", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const rawRating = book?.rating ?? book?.average_rating;
  const rating =
    typeof rawRating === "number"
      ? rawRating.toFixed(1)
      : rawRating
      ? String(rawRating)
      : "4.8";
  const authorName = Array.isArray(book?.author)
    ? book.author.map((a) => (typeof a === "object" ? a.name || a.sortingname || "" : a)).filter(Boolean).join(", ")
    : typeof book?.author === "object"
    ? book.author.name || book.author.sortingname || "Noma'lum muallif"
    : book?.author || "Noma'lum muallif";

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl p-6 md:p-8 shadow-xs flex flex-col gap-6 font-interface">
      {/* Category Pill & Rating Star */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="text-xs font-bold text-[var(--navy-primary)] bg-[var(--navy-light)] rounded-full px-3 py-1">
          {book?.category?.name || "Tibbiyot · Anatomiya"}
        </span>

        <div className="flex items-center gap-1.5 bg-[var(--bg-subtle)] border border-[var(--border-main)] rounded-lg px-2.5 py-1">
          <FaStar className="text-[#e0a32e] text-xs" />
          <span className="text-xs font-extrabold text-[var(--text-main)]">{rating}</span>
          <span className="text-[11.5px] text-[var(--text-subtle)] font-semibold">({commentCount || 12} baho)</span>
        </div>
      </div>

      {/* Editorial Title & Author */}
      <div className="flex flex-col gap-1.5">
        <h1 className="font-editorial text-3xl md:text-4xl font-normal leading-tight text-[var(--text-main)]">
          {book?.title || book?.name}
        </h1>
        <span className="text-sm font-semibold text-[var(--text-muted)]">
          Muallif: <b className="text-[var(--text-main)]">{authorName}</b>
        </span>
      </div>

      <div className="h-px bg-[var(--border-main)]" />

      {/* Metadata Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[var(--bg-subtle)] border border-[var(--border-main)] rounded-xl p-4">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-extrabold tracking-wider uppercase text-[var(--text-subtle)]">
            Nashriyot
          </span>
          <span className="text-xs font-bold text-[var(--text-main)] truncate">
            {book?.publisher || "O'zbekiston NMIU"}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-extrabold tracking-wider uppercase text-[var(--text-subtle)]">
            Chop yili
          </span>
          <span className="text-xs font-bold text-[var(--text-main)]">
            {pubDate || "2023 yil"}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-extrabold tracking-wider uppercase text-[var(--text-subtle)]">
            Betlar soni
          </span>
          <span className="text-xs font-bold text-[var(--text-main)]">
            {book?.pages ? `${book.pages} bet` : "444 bet"}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-extrabold tracking-wider uppercase text-[var(--text-subtle)]">
            ISBN
          </span>
          <span className="text-xs font-bold text-[var(--text-main)] truncate">
            {book?.isbn || "978-9943-00-123-4"}
          </span>
        </div>
      </div>

      {/* Annotatsiya Section */}
      <div className="flex flex-col gap-2.5">
        <h2 className="text-base font-extrabold text-[var(--text-main)] tracking-tight">
          Annotatsiya
        </h2>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed whitespace-pre-line">
          {book?.description ||
            "Ushbu darslik aliylarda tahsil olayotgan talabalar, magistrlar va amaliyotchi shifokorlar uchun mo'ljallangan. Unda odam a'zolari va tizimlarining tuzilishi, funksiyalari hamda klinik ahamiyati atroflicha yoritilgan."}
        </p>
      </div>

      {/* Tags Chips */}
      {book?.tags && book.tags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap pt-2">
          <span className="text-xs text-[var(--text-subtle)] font-semibold">Teglar:</span>
          {book.tags.map((tag) => (
            <span
              key={tag.id || tag}
              className="text-xs font-semibold text-[var(--text-muted)] bg-[var(--bg-subtle)] border border-[var(--border-main)] rounded-full px-3 py-1"
            >
              #{tag.name || tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
