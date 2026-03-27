import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { useParams } from "react-router";
import { fetchComments } from "../../../services/commentService";
import { formatDateReadable } from "../../../utils/helper";

export default function ReviewList() {
  const [comments, setComments] = useState({});
  const { id } = useParams();
  let isMounted = false;
  useEffect(() => {
    if (isMounted) return;
    fetchComments(id).then(setComments);

    return () => {
      isMounted = true;
    };
  }, []);
  const handleLoadMore = () => {
    /* Keyingi sharhlarni yuklash */ console.log("Yana sharhlar...");
  };

  return (
    comments.results &&
    comments.results.length > 0 && (
      <div className="rounded-2xl bg-white p-6 shadow-[0_6px_20px_rgba(0,0,0,0.08)]">
        <h3 className="text-base font-bold text-[#143c7b] mb-4">
          Oxirgi sharhlar
        </h3>
        <div className="space-y-6">
          {comments.results.map((review) => (
            <div
              key={review.id}
              className="border-b border-gray-100 pb-6 last:border-none last:pb-0"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-bold text-gray-800">
                    {/* {review.user.first_name} {review.user.last_name} */}
                    {review.user.username}
                  </p>
                  <p className="text-xs text-gray-400 font-medium">
                    {formatDateReadable(review.c_at)}
                  </p>
                </div>
                <div className="flex text-yellow-400 text-sm">
                  {Array.from({ length: review.rating }).map((_, index) => (
                    <FaStar key={index} />
                  ))}
                </div>
              </div>

              <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                {review.content}
              </p>
            </div>
          ))}
        </div>
        {comments.next && (
          <button
            onClick={handleLoadMore}
            className="mt-6 w-full cursor-pointer text-sm font-semibold text-[#1a478e] hover:text-blue-800 transition"
          >
            Yana sharhlarni yuklash...
          </button>
        )}
      </div>
    )
  );
}
