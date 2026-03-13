import api from './api';

export async function fetchCategories() {
  let data = await api.get("categories")
  return data.results
}

export async function fetchMainPageStats() {
  let data = await api.get("/main-page-stats/")
  return data
}

export default {
    fetchCategories,
    fetchMainPageStats
}