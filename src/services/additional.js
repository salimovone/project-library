import api from './api';

export async function fetchCategories() {
  let data = await api.get("categories")
  return data.results
}

export default {
    fetchCategories
}