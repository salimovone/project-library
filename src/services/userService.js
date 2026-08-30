import api from './api';

/** Get authenticated user profile */
export async function getMe() {
  let data = await api.get("/me/");
  return data;
}

/** Get paginated users list (admin/librarian view) */
export async function fetchUsersList(filterByRole, page = 1, search = "") {
  const params = {};
  if (filterByRole) params.role = filterByRole;
  if (page) params.page = page;
  if (search) params.search = search;

  let data = await api.get("/users/", { params });
  return data;
}

/** Change current user password */
export async function changePassword(payload) {
  // payload: { old_password, new_password }
  let data = await api.post("/change-password/", payload);
  return data;
}

/** Logout current user */
export async function logoutUser(refreshToken) {
  let data = await api.post("/logout/", { refresh: refreshToken });
  return data;
}

export default {
  getMe,
  fetchUsersList,
  changePassword,
  logoutUser
};