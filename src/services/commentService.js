import api from "./api";

export async function fetchComments(bookId) {
  let data = await api.get(`kitob/${bookId}/comments`)
  return data
}