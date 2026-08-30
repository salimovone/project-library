import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { fetchBook } from "../../services/bookService";
import {
  BookCoverCard,
  BookDetailsPanel,
  NotFoundScreen,
  BookHistoryCard,
} from "./components";
import useRole from "../../hooks/useRole";
import CustomerReviewsSection from "./components/CustomerReviewSection";

export default function BookDetailPage() {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentCount, setCommentCount] = useState(0);
  const { id } = useParams();
  const { checkUserLevel } = useRole();
  const isAdmin = checkUserLevel("admin");

  useEffect(() => {
    const loadBook = async () => {
      setLoading(true);
      try {
        const data = await fetchBook(id);
        setBook(data);
      } catch (error) {
        console.error("Kitobni yuklashda xatolik:", error);
        setBook(null);
      } finally {
        setLoading(false);
      }
    };

    loadBook();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[var(--navy-primary)] font-bold text-lg font-interface">
        Kitob ma'lumotlari yuklanmoqda...
      </div>
    );
  }

  if (!book) {
    return <NotFoundScreen />;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-page)] font-interface transition-colors duration-300">
      {/* Breadcrumbs Bar */}
      <div className="bg-[var(--bg-card)] border-b border-[var(--border-main)] py-3 px-4 md:px-10">
        <div className="max-w-[1320px] mx-auto flex items-center gap-2 text-xs md:text-sm font-semibold text-[var(--text-subtle)]">
          <Link to="/" className="text-[var(--navy-primary)] dark:text-blue-300 hover:underline">
            Bosh sahifa
          </Link>
          <span>/</span>
          <Link to="/books" className="text-[var(--navy-primary)] dark:text-blue-300 hover:underline">
            Kutubxona
          </Link>
          <span>/</span>
          <span className="text-[var(--text-main)] font-bold truncate max-w-[300px]">
            {book?.title || book?.name}
          </span>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-[1320px] mx-auto px-4 md:px-10 py-8 flex flex-col gap-8">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 items-start">
          <BookCoverCard book={book} />
          <div className="flex flex-col gap-8 w-full">
            <BookDetailsPanel commentCount={commentCount} book={book} />
            <CustomerReviewsSection
              setCommentCountCallback={setCommentCount}
              book={book}
            />
          </div>
        </div>

        {isAdmin && <BookHistoryCard book={book} />}
      </div>
    </div>
  );
}