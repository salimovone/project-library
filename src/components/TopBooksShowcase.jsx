import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { FaStar, FaTrophy, FaArrowRight, FaEye, FaBookmark } from "react-icons/fa";
import { FiTrendingUp } from "react-icons/fi";

const DEFAULT_TOP_BOOKS = [
  {
    id: 1,
    name: "Odam anatomiyasi",
    author: "A. G'. Ahmedov",
    rating: 4.9,
    view_count: "2,450",
    category_name: "Tibbiyot",
    cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80",
    description: "Inson anatomiyasi va fiziologiyasiga oid eng mashhur darslik.",
  },
  {
    id: 2,
    name: "O'tkan kunlar",
    author: "Abdulla Qodiriy",
    rating: 4.9,
    view_count: "1,980",
    category_name: "Badiiy adabiyot",
    cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&q=80",
    description: "O'zbek adabiyotining birinchi romani va tengsiz bestseller.",
  },
  {
    id: 3,
    name: "JavaScript: The Good Parts",
    author: "Douglas Crockford",
    rating: 4.8,
    view_count: "1,620",
    category_name: "Dasturlash",
    cover: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&q=80",
    description: "Zamonaviy dasturlash tili asoslari bo'yicha mukammal qo'llanma.",
  },
];

export default function TopBooksShowcase({ books = [], className = "" }) {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Use provided books or fallback to DEFAULT_TOP_BOOKS
  const displayBooks = (books && books.length >= 3)
    ? books.slice(0, 3)
    : books && books.length > 0
      ? [...books, ...DEFAULT_TOP_BOOKS.slice(books.length)].slice(0, 3)
      : DEFAULT_TOP_BOOKS;

  // Auto-play timer
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % displayBooks.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isHovered, displayBooks.length]);

  const activeBook = displayBooks[activeIndex] || displayBooks[0];

  // Helper getters for properties
  const getImageUrl = (b) => b?.img || b?.cover_image || b?.cover;
  const getTitle = (b) => b?.name || b?.title || "Noma'lum kitob";
  const getAuthors = (b) => {
    if (Array.isArray(b?.author)) {
      return b.author.map((a) => (typeof a === "object" ? a.name || a.sortingname || "" : a)).filter(Boolean).join(", ");
    }
    if (typeof b?.author === "object") {
      return b.author.name || b.author.sortingname || "Noma'lum muallif";
    }
    return b?.author || "Noma'lum muallif";
  };
  const getRating = (b) => {
    const raw = b?.rating ?? b?.average_rating;
    if (typeof raw === "number") return raw.toFixed(1);
    if (raw) return String(raw);
    return "4.8";
  };
  const getViews = (b) => b?.view_count || b?.reads || "1 450";
  const getCategory = (b) => b?.category_name || b?.category?.name || "Tavsiya qilingan";

  const rankBadges = ["🥇", "🥈", "🥉"];
  const rankColors = [
    "from-amber-400 to-yellow-600 text-amber-950",
    "from-slate-300 to-slate-400 text-slate-900",
    "from-amber-600 to-amber-800 text-amber-100",
  ];

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl p-5 shadow-sm flex flex-col gap-4 relative overflow-hidden transition-all duration-300 ${className}`}
    >
      {/* Subtle decorative glow accent */}
      <span className="absolute -top-16 -right-16 w-36 h-36 bg-[radial-gradient(circle,rgba(158,27,50,0.12)_0%,transparent_70%)] pointer-events-none" />

      {/* Header Bar */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[var(--crimson-primary)]/10 text-[var(--crimson-primary)] text-xs font-bold">
            <FaTrophy className="text-xs" />
          </span>
          <div className="flex flex-col">
            <span className="text-xs font-extrabold tracking-wider uppercase text-[var(--text-main)] flex items-center gap-1.5">
              TOP 3 <FiTrendingUp className="text-[var(--crimson-primary)] text-xs" />
            </span>
            <span className="text-[11px] text-[var(--text-subtle)] font-medium">
              Kutubxonamizning eng o'qilgan kitoblari
            </span>
          </div>
        </div>

        {/* Rank Tabs */}
        <div className="flex items-center gap-1 bg-[var(--bg-subtle)] border border-[var(--border-main)] rounded-lg p-0.5">
          {displayBooks.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center gap-1 ${activeIndex === idx
                ? "bg-[var(--navy-primary)] text-white shadow-xs"
                : "text-[var(--text-subtle)] hover:text-[var(--text-main)]"
                }`}
              title={`TOP #${idx + 1}`}
            >
              <span>{rankBadges[idx]}</span>
              <span>#{idx + 1}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Featured Active Book Highlight */}
      <div
        onClick={() => navigate(`/books/${activeBook.id}`)}
        className="group relative bg-gradient-to-br from-[var(--bg-subtle)] to-[var(--bg-card)] border border-[var(--border-main)] hover:border-[var(--navy-primary)]/40 rounded-xl p-3.5 flex gap-3.5 items-center transition-all duration-300 cursor-pointer shadow-xs"
      >
        {/* Cover image with rank badge */}
        <div className="relative shrink-0">
          {getImageUrl(activeBook) ? (
            <img
              src={getImageUrl(activeBook)}
              alt={getTitle(activeBook)}
              className="w-[72px] h-[100px] rounded-lg object-cover shadow-md group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-[72px] h-[100px] rounded-lg bg-gradient-to-br from-[#2a538f] to-[#162d52] flex items-center justify-center relative overflow-hidden shadow-md group-hover:scale-105 transition-transform duration-300">
              <span className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--crimson-primary)]" />
              <FaBookmark className="text-white/40 text-xl" />
            </div>
          )}

          {/* Rank Badge overlay */}
          <span className={`absolute -top-1.5 -left-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r ${rankColors[activeIndex]} shadow-sm border border-white/20`}>
            #{activeIndex + 1}
          </span>
        </div>

        {/* Content details */}
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--crimson-primary)] bg-[var(--crimson-primary)]/10 px-2 py-0.5 rounded-md truncate max-w-[120px]">
              {getCategory(activeBook)}
            </span>
            <span className="flex items-center gap-1 text-[11.5px] font-extrabold text-[var(--text-main)] ml-auto shrink-0">
              <FaStar className="text-[#e0a32e] text-[11px]" />
              {getRating(activeBook)}
            </span>
          </div>

          <h3 className="text-sm font-bold text-[var(--text-main)] leading-snug line-clamp-1 group-hover:text-[var(--navy-primary)] dark:group-hover:text-blue-400 transition-colors">
            {getTitle(activeBook)}
          </h3>

          <p className="text-xs text-[var(--text-subtle)] truncate">
            {getAuthors(activeBook)}
          </p>

          <div className="flex items-center justify-between mt-1 pt-1.5 border-t border-[var(--border-main)]">
            <span className="text-[11px] text-[var(--text-subtle)] font-medium flex items-center gap-1">
              <FaEye className="text-[10px] opacity-70" /> {getViews(activeBook)} o'qildi
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-[var(--navy-primary)] dark:text-blue-400 group-hover:translate-x-1 transition-transform">
              Batafsil <FaArrowRight className="text-[10px]" />
            </span>
          </div>
        </div>
      </div>

      {/* Mini List of All 3 Top Books */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[10.5px] font-extrabold tracking-wider uppercase text-[var(--text-subtle)] px-0.5">
          Kuchli Uchlik Katalogi
        </span>
        <div className="grid grid-cols-3 gap-1.5">
          {displayBooks.map((book, idx) => {
            const isActive = activeIndex === idx;
            return (
              <button
                key={book.id || idx}
                onClick={() => setActiveIndex(idx)}
                className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all cursor-pointer ${isActive
                  ? "bg-[var(--navy-primary)] text-white border-[var(--navy-primary)] shadow-xs"
                  : "bg-[var(--bg-subtle)] text-[var(--text-main)] border-[var(--border-main)] hover:border-[var(--navy-light-border)] hover:bg-[var(--bg-card)]"
                  }`}
              >
                <span className={`text-xs font-bold shrink-0 ${isActive ? "text-amber-300" : "text-[var(--text-subtle)]"}`}>
                  {rankBadges[idx]}
                </span>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className={`text-xs font-bold truncate leading-tight ${isActive ? "text-white" : "text-[var(--text-main)]"}`}>
                    {getTitle(book)}
                  </span>
                  <span className={`text-[10px] truncate ${isActive ? "text-blue-100" : "text-[var(--text-subtle)]"}`}>
                    ⭐ {getRating(book)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
