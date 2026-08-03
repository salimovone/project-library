import api from './api';

export async function fetchLatestBooks(howMany = 8) {
  let data = await api.get("/kitob/", { params: { page_size: howMany, sort: "latest" } });
  return data.results || data;
}

export async function fetchBooks(filters = {}) {
  const params = {};

  if (filters?.page) params.page = filters.page;
  if (filters?.page_size) params.page_size = filters.page_size;

  if (filters?.search) {
    params.search = filters.search;
    let data = await api.get('/kitob/', { params });
    return data;
  }

  if (filters?.category) params.category = filters.category;
  if (filters?.subcategory) params.subcategory = filters.subcategory;
  if (filters?.tag || filters?.tags) params.tags = filters.tag || filters.tags;
  if (filters?.author) params.author = filters.author;
  if (filters?.sort) params.sort = filters.sort;

  if (filters?.book_format) {
    const formats = Object.keys(filters.book_format).filter(key => !filters.book_format[key]);
    if (formats.length > 0) {
      for (const element of formats) {
        params[element] = true;
      }
    }
  }

  let data = await api.get('/kitob/', { params });
  return data;
}

export async function fetchBook(id) {
  let data = await api.get(`/kitob/${id}/`);
  return data;
}

export async function createBook(bookData) {
  return api.post('/kitob/', bookData);
}

export async function updateBook(id, bookData) {
  return api.put(`/kitob/${id}/`, bookData);
}

export async function patchBook(id, bookData) {
  return api.patch(`/kitob/${id}/`, bookData);
}

export async function deleteBook(id) {
  return api.delete(`/kitob/${id}/`);
}

/** Upload book cover image */
export async function uploadBookImage(id, formData) {
  return api.post(`/kitob/${id}/image/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

/** Import books from Excel file (.xlsx) */
export async function importExcelBooks(formData) {
  return api.post('/kitob/import_excel/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

/** Rate and comment a book in one request */
export async function rateAndCommentBook(id, payload) {
  return api.post(`/kitob/${id}/rate_and_comment/`, payload);
}

/** Get similar book recommendations */
export async function fetchSimilarBooks(id) {
  let data = await api.get(`/kitob/${id}/similar/`);
  return data;
}

/** Get book stats (reservations, ratings) */
export const getBookStats = async (bookId) => {
  const res = await api.get(`/book-detail-stats/`, { params: { book_id: bookId } });
  return res;
};

export const getTags = async (search) => {
  const res = await api.get("/tags/", { params: { search } });
  return res.results || res;
};

export const createTag = async (name) => {
  const res = await api.post("/tags/", { name });
  return res;
};

export const getAuthors = async (search) => {
  const res = await api.get("/authors/", { params: { search } });
  return res.results || res;
};

export const createAuthor = async (authorData) => {
  const payload = typeof authorData === 'string' ? { name: authorData } : authorData;
  const res = await api.post("/authors/", payload);
  return res;
};

export async function fetchTopBooksPaginated(page = 1, pageSize = 26) {
  let data = await api.get('/kitob/', {
    params: {
      sort: 'rating-high',
      page: page,
      page_size: pageSize
    }
  });
  return data;
}

export default {
  fetchLatestBooks,
  fetchBooks,
  fetchBook,
  createBook,
  updateBook,
  patchBook,
  deleteBook,
  uploadBookImage,
  importExcelBooks,
  rateAndCommentBook,
  fetchSimilarBooks,
  getBookStats,
  getTags,
  createTag,
  getAuthors,
  createAuthor,
  fetchTopBooksPaginated
};
