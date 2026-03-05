import api from './api';

export async function fetchLatestBooks(howMany = 8) {
  let data = await api.get("kitob", {params: {"page_size": howMany, "sort": "latest"}})
  return data.results
}

export async function fetchBooks() {
  let data = await api.get('/kitob')
  return data.results;
}

export async function fetchBook(id) {
  let data = await api.get(`/kitob/${id}`);
  return data;
}

export async function createBook(book) {
  return api.post('/kitob', book);
}

export async function updateBook(id, book) {
  return api.put(`/kitob/${id}`, book);
}

export async function deleteBook(id) {
  return api.delete(`/kitob/${id}`);
}

export default {
  fetchLatestBooks,
  fetchBooks,
  fetchBook,
  createBook,
  updateBook,
  deleteBook,
};
