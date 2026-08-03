import api from "./api";

export async function fetchBookmarks(page = 1) {
  let data = await api.get('/bookmarks/', { params: { page } });
  return data;
}

export async function fetchBookmarkById(id) {
  let data = await api.get(`/bookmarks/${id}/`);
  return data;
}

export async function createBookmark(bookId) {
  let data = await api.post('/bookmarks/', { book: bookId });
  return data;
}

export async function deleteBookmark(id) {
  let data = await api.delete(`/bookmarks/${id}/`);
  return data;
}

export default {
  fetchBookmarks,
  fetchBookmarkById,
  createBookmark,
  deleteBookmark,
};