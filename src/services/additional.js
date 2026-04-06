import api from './api';

export async function fetchCategories() {
  let data = await api.get("/categories/")
  return data.results
}

export async function fetchSubcategories() {
  let data = await api.get("/subcategories/")
  return data.results
}

export async function fetchMainPageStats() {
  let data = await api.get("/main-page-stats/")
  return data
}

export async function fetchUserProfileStats(user_id) {
  let data = await api.get("/user-profile-stats", { params: { "user_id": user_id } })
  return data
}

export async function fetchTags() {
  let data = await api.get("/tags/")
  return data.results
}

export default {
    fetchCategories,
    fetchSubcategories,
    fetchMainPageStats,
    fetchUserProfileStats,
    fetchTags
}