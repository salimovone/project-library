import api from './api';

export async function getMe() {
  let data = await api.get("/me/")
  return data
}

export async function fetchBookmarks() {
  let data = await api.get("/bookmarks")
  return data
}

export default {
  getMe,
  fetchBookmarks
}