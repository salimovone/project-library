import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { fetchBook } from "../../services/bookService";
import {
  BookCoverCard,
  BookDetailsPanel,
} from "./components";
import CustomerReviewsSection from "./components/CustomerReviewSection";

export default function BookDetailPage() {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetchBook(id).then(setBook);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#1a478e] font-semibold">
        Yuklanmoqda...
      </div>
    );
  }

  if (!loading && !book) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 font-semibold">
        Kitob topilmadi.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#121212] py-8 font-sans transition-colors duration-300">
      <div className="custom-container mx-auto px-4 md:px-6 space-y-8">
        <div className="grid gap-6 lg:grid-cols-[300px_1fr] xl:grid-cols-[340px_1fr]">
          <BookCoverCard book={book} />
          <BookDetailsPanel commentCount={commentCount} book={book} />
        </div>

        <div className="space-y-6 w-full">
          <CustomerReviewsSection setCommentCountCallback={setCommentCount} book={book} />
        </div>
      </div>
    </div>
  );
}
