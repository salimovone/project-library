import {useEffect, useMemo, useState} from "react";
import {useParams} from "react-router";
import {fetchComments} from "../../../services/commentService";
import Comment from "./Comment";
import { buildCommentTree } from "../../../utils/comments";

export default function ReviewList({newComment}) {
	const [comments, setComments] = useState({});
	const {id} = useParams();

	const fetchBookComments = () => {
		fetchComments(id).then(setComments);
	};

	useEffect(() => {
		fetchBookComments();
	}, [newComment]);

	const commentTree = useMemo(() => {
		return buildCommentTree(comments.results || []);
	}, [comments.results]);

	const handleLoadMore = () => {
		// TODO: Implement pagination for comments
		console.log("Yana sharhlar...");
	};

	if (!comments.results || comments.results.length === 0) return null;

	return (
		<div className="rounded-2xl bg-white p-6 shadow-[0_6px_20px_rgba(0,0,0,0.08)]">
			<h3 className="text-base font-bold text-[#143c7b] mb-4">
				Oxirgi sharhlar
			</h3>
			<div className="space-y-6">
				{commentTree.map(review => (
					<Comment
						key={review.id}
						comment={review}
						onCommentPosted={fetchBookComments}
					/>
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
	);
}
