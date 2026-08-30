import React from 'react';
import { FaStar } from 'react-icons/fa';

const BookCard = ({
  book,
  title = "Kitob nomi",
  author = "Noma'lum muallif",
  coverImage,
  rating = "0.0",
  badgeText = "",
  hasPdf = true,
  hasAudio = false,
  hasPhysical = true,
  onClick,
  className = "",
}) => {
  // Support passing a book object directly or individual props
  const bookTitle = book?.title || book?.name || title;
  const bookAuthor = Array.isArray(book?.author)
    ? book.author.map((a) => (typeof a === "object" ? a.name || a.sortingname || "" : a)).filter(Boolean).join(", ")
    : typeof book?.author === "object"
    ? book.author.name || book.author.sortingname || author
    : book?.author || author;
  const bookRating = book?.average_rating || book?.rating || rating;
  const bookBadge = book?.is_new ? "YANGI" : badgeText;
  const bookPdf = book ? !!book.file_pdf : hasPdf;
  const bookAudio = book ? !!book.file_audio : hasAudio;
  const bookPhysical = book ? (book.total_copies > 0) : hasPhysical;
  const bookCover = book?.img || book?.cover_image || book?.cover || coverImage;

  return (
    <div
      onClick={onClick}
      className={`group flex flex-col bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl overflow-hidden font-interface shadow-xs hover:shadow-lg hover:border-[var(--border-strong)] transition-all duration-300 cursor-pointer ${className}`}
    >
      <div className="relative p-2.5 pb-0">
        {bookCover ? (
          <div className="relative aspect-3/4 rounded-xl overflow-hidden">
            <img
              src={bookCover}
              alt={bookTitle}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {bookBadge && (
              <span className="absolute top-2.5 right-2.5 bg-[var(--crimson-primary)] text-white text-[9.5px] font-extrabold tracking-wider uppercase px-2 py-1 rounded-md shadow-sm">
                {bookBadge}
              </span>
            )}
          </div>
        ) : (
          <div className="relative aspect-3/4 rounded-xl overflow-hidden bg-gradient-to-br from-[#3d6cb0] via-[#2a538f] to-[#1b3f7a] flex flex-col items-center justify-center p-4 text-center group-hover:scale-[1.02] transition-transform duration-300">
            <span className="absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(255,255,255,0.16),transparent_55%)] pointer-events-none" />
            <span className="absolute left-0 top-0 bottom-0 w-1.5 bg-[var(--crimson-primary)]" />
            
            <span className="font-editorial text-lg md:text-xl font-normal text-white relative leading-snug line-clamp-3">
              {bookTitle}
            </span>
            <span className="w-5 h-0.5 bg-[var(--crimson-accent)] rounded-full my-2.5 relative" />
            <span className="text-[11.5px] font-semibold text-[#b9c6de] relative tracking-wide line-clamp-1">
              {bookAuthor}
            </span>

            {bookBadge && (
              <span className="absolute top-2.5 right-2.5 bg-[var(--crimson-primary)] text-white text-[9.5px] font-extrabold tracking-wider uppercase px-2 py-1 rounded-md shadow-xs">
                {bookBadge}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1 p-3 md:p-3.5 flex-1">
        <span className="text-sm font-bold text-[var(--text-main)] leading-snug tracking-tight truncate">
          {bookTitle}
        </span>
        <span className="text-[12.5px] font-medium text-[var(--text-muted)] truncate">
          {bookAuthor}
        </span>

        <div className="flex items-center justify-between gap-2 mt-auto pt-3">
          <div className="flex items-center gap-1.5">
            {bookPdf && (
              <span title="PDF" className="flex items-center h-5 px-1.5 rounded-md bg-[var(--orange-pdf-bg)] text-[var(--orange-pdf)] text-[10px] font-extrabold tracking-wider">
                PDF
              </span>
            )}
            {bookAudio && (
              <span title="Audio" className="flex items-center h-5 px-1.5 rounded-md bg-[var(--crimson-light)] text-[var(--crimson-primary)] text-[10px] font-extrabold tracking-wider">
                AUDIO
              </span>
            )}
            {bookPhysical && (
              <span title="Kutubxonada bor" className="flex items-center h-5 px-1.5 rounded-md bg-[var(--navy-light)] text-[var(--navy-primary)] text-[10px] font-extrabold tracking-wider">
                FIZIK
              </span>
            )}
          </div>
          <span className="flex items-center gap-1 text-[12.5px] font-extrabold text-[var(--text-main)]">
            <FaStar className="text-[#e0a32e] text-xs" />
            {bookRating}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BookCard;