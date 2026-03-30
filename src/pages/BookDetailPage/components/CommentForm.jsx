import { useState } from "react";
import { FaStar } from "react-icons/fa";

export default function CommentForm({
  onSubmit,
  onCancel,
  submitLabel,
  hasRating = false,
}) {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(comment, rating);
    setComment("");
    setRating(0);
  };

  return (
    <form onSubmit={handleSubmit}>
      {hasRating && (
        <div className="flex items-center mb-4">
          <span className="text-lg font-semibold mr-4">Your rating:</span>
          <div className="flex">
            {[...Array(5)].map((_, index) => {
              const ratingValue = index + 1;
              return (
                <label key={ratingValue}>
                  <input
                    type="radio"
                    name="rating"
                    value={ratingValue}
                    onClick={() => setRating(ratingValue)}
                    className="hidden"
                  />
                  <FaStar
                    className="cursor-pointer"
                    color={ratingValue <= rating ? "#ffc107" : "#e4e5e9"}
                    size={24}
                  />
                </label>
              );
            })}
          </div>
        </div>
      )}
      <textarea
        className="w-full border rounded-lg p-3 text-sm"
        rows="4"
        placeholder="Write your comment here..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
      ></textarea>
      <div className="flex justify-end mt-4 gap-2">
        {onCancel && (
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
          disabled={!comment}
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
