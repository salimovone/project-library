import api from "./api";

export async function fetchComments(bookId) {
  let data = await api.get(`kitob/${bookId}/comments/`)
  return data
}

export async function postComment(bookId, content, replyTo = null, rating = null) {
  let data = {
    content
  }
  if (replyTo !== null)
    data["reply_to"] = replyTo

  let res = await api.post(`kitob/${bookId}/comments/`, data)
  return res
}

export async function postRatingComment(bookId, content, rating = null) {
  let data = {
    content: content,
    score: rating
  }
  
  let res = await api.post(`kitob/${bookId}/rate_and_comment/`, data)
  return res
}

export default {
  fetchComments,
  postComment,
  postRatingComment
}