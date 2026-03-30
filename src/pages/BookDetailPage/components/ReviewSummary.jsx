import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router";
import { FaStar } from "react-icons/fa";
import useRole from "../../../hooks/useRole";
import { postRatingComment } from "../../../services/commentService";
import { getBookStats } from "../../../services/bookService";
import CommentForm from "./CommentForm";

export default function ReviewSummary({ onCommentPosted, book }) {
  const { checkUserLevel } = useRole();
  const { id } = useParams();
  
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [apiStats, setApiStats] = useState(null);
  const [isApiLoading, setIsApiLoading] = useState(true);

  // 1. API dan ma'lumotlarni yuklash
  const fetchStats = async () => {
    try {
      setIsApiLoading(true);
      const data = await getBookStats(id);
      setApiStats(data);
    } catch (error) {
      console.error("Stats yuklashda xatolik:", error);
    } finally {
      setIsApiLoading(false);
    }
  };

  useEffect(() => {
    fetchStats().then(() => {
		console.log("Stats ma'lumotlari:", apiStats);
	});
  }, [id]);

  // 2. Hisob-kitoblar (apiStats null bo'lsa ham xato bermaydi)
  const statsData = useMemo(() => {
    const data = apiStats || {
      total_ratings: 0,
      star1: 0, star2: 0, star3: 0, star4: 0, star5: 0,
      self_score: null,
    };

    const total = data.total_ratings || 0;
    const getPercent = (count) => (total > 0 ? Math.round((count / total) * 100) : 0);

    return {
      totalReviews: total,
      selfScore: data.self_score,
      distribution: {
        5: { count: data.star5, percent: getPercent(data.star5) },
        4: { count: data.star4, percent: getPercent(data.star4) },
        3: { count: data.star3, percent: getPercent(data.star3) },
        2: { count: data.star2, percent: getPercent(data.star2) },
        1: { count: data.star1, percent: getPercent(data.star1) },
      },
    };
  }, [apiStats]);

  // 3. Sharh qoldirish mantiqi
  const handlePostComment = async (comment, rating) => {
    try {
      await postRatingComment(id, comment, rating);
      setShowCommentForm(false);
      onCommentPosted(); // Ro'yxatni yangilash uchun parentga xabar
      await fetchStats(); // Statlarni yangilash
    } catch (error) {
      console.error("Sharh yuborishda xatolik:", error);
    }
  };

  return (
    <div className={`rounded-2xl bg-white p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-500 ${isApiLoading ? "opacity-60 pointer-events-none" : "opacity-100"}`}>
      <div className="flex flex-col gap-10 lg:flex-row lg:items-center">
        
        {/* Chap taraf: O'rtacha reyting */}
        <div className="flex-none text-center lg:text-left lg:w-1/4">
          <h3 className="text-lg font-bold text-[#143c7b] mb-2">Mijozlar bahosi</h3>
          <p className="text-7xl font-black text-[#1a478e] leading-none tracking-tight">
            {book?.average_rating ? Number(book.average_rating).toFixed(1) : "0.0"}
          </p>
          <p className="text-sm text-gray-400 mt-3 font-medium">
            {statsData.totalReviews.toLocaleString()} ta sharh asosida
          </p>
        </div>

        {/* O'rta: Progress barlar va yulduzchalar */}
        <div className="flex-1 space-y-4">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center gap-4">
              <div className="flex items-center gap-2 min-w-[85px]">
                <FaStar
                  className={
                    statsData.selfScore >= star 
                      ? "text-yellow-400 drop-shadow-sm" 
                      : "text-gray-200"
                  }
                  size={20}
                />
                <span className="text-sm font-semibold text-gray-600 whitespace-nowrap">
                  {star} star
                </span>
              </div>

              {/* Progress Bar */}
              <div className="h-2.5 flex-1 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-yellow-400 transition-all duration-1000 ease-out"
                  style={{ width: `${statsData.distribution[star].percent}%` }}
                />
              </div>

              {/* Foiz ko'rsatkichi */}
              <span className="w-12 text-right text-sm font-bold text-gray-500">
                {statsData.distribution[star].percent}%
              </span>
            </div>
          ))}
        </div>

        {/* O'ng taraf: Harakat tugmasi */}
        {!showCommentForm && (
          <div className="flex-none lg:w-1/4 flex justify-center lg:justify-end">
            <button
              onClick={() => setShowCommentForm(true)}
              className="w-full lg:w-auto rounded-xl bg-[#003282] px-10 py-4 text-sm font-bold text-white transition-all hover:bg-[#002663] hover:shadow-lg active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed"
              disabled={!checkUserLevel("student") || isApiLoading}
            >
              {statsData.selfScore ? "Sharhni tahrirlash" : "Sharh qoldirish"}
            </button>
          </div>
        )}
      </div>

      {/* Sharh formasi */}
      {showCommentForm && (
        <div className="mt-10 border-t border-gray-100 pt-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <CommentForm
            onSubmit={handlePostComment}
            onCancel={() => setShowCommentForm(false)}
            submitLabel={statsData.selfScore ? "Tahrirlashni saqlash" : "Sharhni yuborish"}
            hasRating={true}
            initialRating={statsData.selfScore}
          />
        </div>
      )}
    </div>
  );
}