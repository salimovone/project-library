import { useState } from "react";
import { FaStar, FaReply } from "react-icons/fa";
import { formatDateReadable } from "../../../utils/helper";
import useRole from "../../../hooks/useRole";
import CommentForm from "./CommentForm";
import { postComment } from "../../../services/commentService";
import { useParams } from "react-router";

export default function Comment({ comment, onCommentPosted }) {
  const { checkUserLevel } = useRole();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const { id } = useParams();

  const handleReply = () => {
    setShowReplyForm(true);
  };

  const handleCancelReply = () => {
    setShowReplyForm(false);
  };

  const handlePostReply = async (replyText) => {
    try {
      await postComment(id, replyText, comment.id);
      setShowReplyForm(false);
      onCommentPosted();
    } catch (error) {
    }
  };

  return (
    <div className="border-b border-gray-100 pb-6 last:border-none last:pb-0">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-sm font-bold text-gray-800">
            {comment.user.first_name ? comment.user.first_name + " " + comment.user.last_name : comment.user.username}
          </p>
          <p className="text-xs text-gray-400 font-medium">
            {formatDateReadable(comment.c_at)}
          </p>
        </div>
        <div className="flex text-yellow-400 text-sm">
          {Array.from({ length: comment.rating_score || 0 }).map((_, index) => (
            <FaStar key={index} />
          ))}
        </div>
      </div>

      <p className="mt-1 text-sm text-gray-600 leading-relaxed">
        {comment.content}
      </p>

      {checkUserLevel("student") && (
        <div className="mt-2">
          {!showReplyForm ? (
            <button
              onClick={handleReply}
              className="flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-blue-600"
            >
              <FaReply />
              Reply
            </button>
          ) : (
            <div className="mt-4">
              <CommentForm
                onSubmit={handlePostReply}
                onCancel={handleCancelReply}
                submitLabel="Post Reply"
              />
            </div>
          )}
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-8 mt-4 border-l-2 border-gray-100 pl-4">
          {comment.replies.map((reply) => (
            <Comment key={reply.id} comment={reply} onCommentPosted={onCommentPosted} />
          ))}
        </div>
      )}
    </div>
  );
}
