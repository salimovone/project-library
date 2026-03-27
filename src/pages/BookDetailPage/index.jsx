import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { fetchBook } from "../../services/bookService";
import {
  BookCoverCard,
  BookDetailsPanel,
  ReviewList,
  ReviewSummary,
} from "./components";

export default function BookDetailPage() {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

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

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 font-semibold">
        Kitob topilmadi.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-8 font-sans">
      <div className="custom-container mx-auto px-4 md:px-6 space-y-8">
        {/* Yuqori qism: Rasm va Ma'lumotlar */}
        <div className="grid gap-6 lg:grid-cols-[300px_1fr] xl:grid-cols-[340px_1fr]">
          <BookCoverCard book={book} />
          <BookDetailsPanel book={book} />
        </div>

        {/* Pastki qism: Sharhlar va Reytinglar (max-w cheklovi olib tashlandi) */}
        <div className="space-y-6 w-full">
          <ReviewSummary />
          <ReviewList />
        </div>
      </div>
    </div>
  );
}
