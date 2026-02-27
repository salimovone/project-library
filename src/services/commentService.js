import api from "./api";

export async function fetchComments(bookId) {
//   let data = await api.get(`kitob/${bookId}/comments`)
  let data = await api.get(`comments`)
  return data
}