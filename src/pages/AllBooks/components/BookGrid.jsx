import { useNavigate } from "react-router";
import BookCard from "../../../components/BookCard";

const BookCardSkeleton = () => (
  <div className="animate-pulse bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl p-3 h-80 flex flex-col gap-3">
    <div className="bg-[var(--bg-subtle)] rounded-xl h-52 w-full" />
    <div className="h-4 bg-[var(--bg-subtle)] rounded w-3/4" />
    <div className="h-3 bg-[var(--bg-subtle)] rounded w-1/2" />
  </div>
);

export default function BookGrid({ books, isLoading }) {
  const navigate = useNavigate();

  if (!isLoading && (!books || books.length === 0)) {
    return (
      <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl p-12 text-center text-[var(--text-muted)] font-interface font-medium">
        Hech qanday kitob topilmadi. Qidiruv yoki filtr parametrlarini o'zgartirib ko'ring.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 min-[2560px]:grid-cols-5 gap-4.5 mb-8 min-w-0">
      {isLoading
        ? Array.from({ length: 8 }).map((_, index) => (
            <BookCardSkeleton key={`skeleton-${index}`} />
          ))
        : books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onClick={() => navigate(`/books/${book.id}`)}
            />
          ))}
    </div>
  );
}
