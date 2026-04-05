import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router";
import { FaStar, FaRegStar } from "react-icons/fa";
import { FiThumbsUp, FiMessageSquare, FiChevronDown, FiX } from "react-icons/fi";
import useRole from "../../../hooks/useRole";
import { postRatingComment, fetchComments } from "../../../services/commentService";
import { getBookStats } from "../../../services/bookService";
import { buildCommentTree } from "../../../utils/comments"; 

export default function CustomerReviewsSection({ book, onUpdate }) {
  const { id } = useParams();
  const { checkUserLevel } = useRole();
  
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [replyTo, setReplyTo] = useState(null); // Qaysi sharhga javob yozilayotgani
  const [apiStats, setApiStats] = useState(null);
  const [commentsData, setCommentsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Forma uchun state-lar
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [stats, comments] = await Promise.all([
        getBookStats(id),
        fetchComments(id)
      ]);
      setApiStats(stats);
      setCommentsData(comments.results || []);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const dateReadableConverter = (x) => {
    const dateString = new Date(x).toLocaleDateString("en-US", {
				year: "numeric",
				month: "short",
				day: "numeric",
			})
    return dateString;
  }

  useEffect(() => { fetchData(); }, [id]);

  // Sharhlarni daraxt ko'rinishiga keltirish
  const commentTree = useMemo(() => {
    return buildCommentTree(commentsData);
  }, [commentsData]);


  const stats = useMemo(() => {
    const data = apiStats || { total_ratings: 0, star1:0, star2:0, star3:0, star4:0, star5:0 };
    const total = data.total_ratings || 1;
    return {
      total: data.total_ratings || 0,
      avg: book?.average_rating || 0,
      dist: [
        { label: "5 star", percent: Math.round((data.star5 / total) * 100) },
        { label: "4 star", percent: Math.round((data.star4 / total) * 100) },
        { label: "3 star", percent: Math.round((data.star3 / total) * 100) },
        { label: "2 star", percent: Math.round((data.star2 / total) * 100) },
        { label: "1 star", percent: Math.round((data.star1 / total) * 100) },
      ]
    };
  }, [apiStats, book]);

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!replyTo && rating === 0) return alert("Iltimos, baho tanlang!");

    try {
      setIsSubmitting(true);
      // Agar replyTo bo'lsa, parent ID bilan yuboramiz
      await postRatingComment(id, commentText, rating, replyTo?.id);
      
      setCommentText("");
      setRating(0);
      setShowCommentForm(false);
      setReplyTo(null);
      await fetchData();
      if (onUpdate) onUpdate();
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sharh komponenti (ichma-ich render bo'ladi)
  const CommentItem = ({ comment, depth = 0 }) => (
    <div className={`group ${depth > 0 ? "ml-8 md:ml-12 mt-6 border-l-2 border-gray-100 pl-4 md:pl-6" : "border-b border-gray-50 pb-8 mb-8 last:border-0"}`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <img 
            src={comment.user?.avatar || `https://ui-avatars.com/api/?name=${comment.user?.first_name}+${comment.user?.last_name}&background=random`} 
            className="w-10 h-10 rounded-full object-cover border border-gray-100"
            alt="avatar"
          />
          <div>
            <h4 className="font-bold text-gray-800 text-sm">{comment.user?.first_name} {comment.user?.last_name}</h4>
            {comment.rating > 0 && (
              <div className="flex text-yellow-400 text-[10px] mt-0.5">
                {[...Array(5)].map((_, i) => (
                  i < comment.rating ? <FaStar key={i}/> : <FaRegStar key={i} className="text-gray-200"/>
                ))}
              </div>
            )}
          </div>
        </div>
        <span className="text-gray-400 text-[11px] italic">{dateReadableConverter(comment.c_at)}</span>
      </div>

      <p className="text-gray-600 leading-relaxed text-sm mb-3">
        {comment.content}
      </p>

      <div className="flex items-center gap-6 text-gray-400 text-[11px] font-bold uppercase tracking-wider">
        <button className="flex items-center gap-1.5 hover:text-indigo-600 transition">
          <FiThumbsUp size={14}/> Helpful ({comment.likes_count || 0})
        </button>
        <button 
          onClick={() => {
            setReplyTo(comment);
            setShowCommentForm(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-1.5 hover:text-indigo-600 transition"
        >
          <FiMessageSquare size={14}/> Reply
        </button>
      </div>

      {/* Rekursiv javoblarni chiqarish */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4">
          {comment.replies.map(reply => (
            <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className={`w-full mx-auto bg-white rounded-3xl p-8 shadow-sm border border-gray-100`}>
      
      {/* 1. Header */}
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-2xl font-bold text-gray-800">Customer Reviews</h2>
        <button 
          onClick={() => { setShowCommentForm(true); setReplyTo(null); }}
          disabled={!checkUserLevel("student")}
          className="bg-[#5c56f1] hover:bg-[#4a44d1] disabled:bg-gray-300 text-white px-6 py-2.5 rounded-lg font-semibold transition-all"
        >
          Write a Review
        </button>
      </div>

      {/* 2. Form (Sharh yoki Javob uchun) */}
      {showCommentForm && (
        <div className="mb-12 p-6 bg-indigo-50/30 rounded-2xl border border-indigo-100 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-indigo-900">
              {replyTo ? `${replyTo.user?.first_name}ga javob yozish` : "Kitobga sharh qoldirish"}
            </h3>
            <button onClick={() => { setShowCommentForm(false); setReplyTo(null); }} className="text-gray-400 hover:text-red-500">
              <FiX size={20} />
            </button>
          </div>

          <form onSubmit={handlePostComment}>
            {!replyTo && (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-gray-600">Baho:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setRating(star)} onMouseEnter={() => setHover(star)} onMouseLeave={() => setHover(0)}>
                      <FaStar size={22} className={(hover || rating) >= star ? "text-yellow-400" : "text-gray-200"} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={replyTo ? "Javobingizni yozing..." : "Fikringizni yozing..."}
              className="w-full p-4 rounded-xl border-0 bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none text-sm min-h-25 mb-4"
              required
            />

            <div className="flex justify-end">
              <button type="submit" disabled={isSubmitting} className="bg-[#5c56f1] text-white px-8 py-2 rounded-lg font-bold hover:bg-[#4a44d1] transition-all disabled:opacity-50">
                {isSubmitting ? "Yuborilmoqda..." : "Yuborish"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. Stats Section */}
      <div className="flex flex-col md:flex-row items-center gap-12 mb-12 pb-12 border-b border-gray-100">
        <div className="text-center md:w-1/3">
          <div className="text-6xl font-bold text-gray-900 mb-2">{Number(stats.avg).toFixed(1)}</div>
          <div className="flex justify-center text-yellow-400 text-xl mb-2">
            {[...Array(5)].map((_, i) => (i < Math.floor(stats.avg) ? <FaStar key={i}/> : <FaRegStar key={i}/>))}
          </div>
          <p className="text-gray-500 text-sm font-medium">Based on {stats.total.toLocaleString()} reviews</p>
        </div>

        <div className="flex-1 w-full space-y-3">
          {stats.dist.map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 text-sm">
              <span className="w-12 text-gray-500 whitespace-nowrap">{item.label}</span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-400 rounded-full transition-all duration-500" style={{ width: `${item.percent}%` }} />
              </div>
              <span className="w-10 text-right text-gray-400">{item.percent}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Comments List (Tree Structure) */}
      <div className="space-y-4">
        {commentTree.length > 0 ? (
          commentTree.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        ) : (
          <p className="text-center text-gray-400 py-10 italic text-sm">Hozircha sharhlar mavjud emas.</p>
        )}
      </div>

      {/* 5. Load More */}
      <div className={"mt-12 text-center" + (commentsData.length === 0 ? " hidden" : "")}>
        <button className="inline-flex items-center gap-2 text-[#5c56f1] font-bold text-xs uppercase tracking-widest hover:underline transition">
          Load More Reviews <FiChevronDown strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}