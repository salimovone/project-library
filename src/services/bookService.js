import api from './api';

export async function fetchLatestBooks(howMany = 8) {
  let data = await api.get("/kitob/", {params: {"page_size": howMany, "sort": "latest"}})
  return data.results
}

export async function fetchBooks(filters) {
  const params = {};

  if (filters?.search) {
    params.search = filters.search;
    let data = await api.get('/kitob', { params });
    return data.results;
  }

  if (filters?.category) {
    params.category = filters.category;
  }
  if (filters?.tag) {
    params.tag = filters.tag;
  }
  if (filters?.author) {
    params.author = filters.author;
  }
  if (filters?.sort) {
    params.sort = filters.sort;
  }

  if (filters?.book_format) {
    const formats = Object.keys(filters.book_format).filter(key => !filters.book_format[key]);
    if (formats.length > 0) {
      for (const element of formats) {
        params[element] = true;   
      }
    }
  }

  let data = await api.get('/kitob', { params });
  return data.results;
}

export async function fetchBook(id) {
  let data = await api.get(`/kitob/${id}`);
  return data;
}

export async function createBook(book) {
  return api.post('/kitob/', book);
}

export async function updateBook(id, book) {
  return api.put(`/kitob/${id}`, book);
}

export async function deleteBook(id) {
  return api.delete(`/kitob/${id}`);
}

export const getTags = async () => {
  const res = await api.get("/tags/");
  return res.results;
}

export const getAuthors = async () => {
  const res = await api.get("/authors/");
  return res.results;
}

export const createAuthor = async (name) => {
  const res = await api.post("/authors/", { name });
  return res;
}

export const createTag = async (name) => {
  const res = await api.post("/tags/", { name });
  return res;
}

export const getBookStats = async (bookId) => {
  const res = await api.get(`/book-detail-stats/`, { params: { book_id: bookId } });
  return res;
};

export default {
  fetchLatestBooks,
  fetchBooks,
  fetchBook,  
  createBook,
  updateBook,
  deleteBook,
  getTags,
  getAuthors,
  createAuthor,
  createTag,
  getBookStats
};
