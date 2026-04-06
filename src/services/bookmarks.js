import api from "./api";

export async function fetchBookmarks() {
  let data = await api.get(`/bookmarks`)
  return data
}