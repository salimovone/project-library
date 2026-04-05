import api from "./api";

export async function fetchRatings(bookId) {
  let data = await api.get(`ratings`, { params: { book_id: bookId } })
  return data
}

export default {
  fetchRatings
}