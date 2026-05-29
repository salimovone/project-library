import api from './api';

export async function getMe() {
  let data = await api.get("/me/")
  return data
}

export async function fetchBookmarks() {
  let data = await api.get("/bookmarks")
  return data
}

export async function fetchUsersList(filterByRole, page, search) {
  const params = {}
  if (filterByRole) {
    params.role = filterByRole
  }
  if (page) {
    params.page = page
  }
  if (search) {
    params.search = search
  }
  let data = await api.get("/users", { params })
  return data

  // example result
  //   {
  //   "count": 123,
  //   "next": "http://api.example.org/accounts/?page=4",
  //   "previous": "http://api.example.org/accounts/?page=2",
  //   "results": [
  //     {
  //       "id": 0,
  //       "username": "V4M4U9ZYukBrZ6eJ@6X-Kr_WSu8hFvASyJGNq2uPiB.9FBeQPmF02QHqmds8H5gVA4WgVnOiy3mvpNLO4a+b4QXDKHRo-UkV",
  //       "email": "user@example.com",
  //       "first_name": "string",
  //       "last_name": "string",
  //       "phone_number": "string",
  //       "role": "admin",
  //       "is_banned": true,
  //       "ban_expires_at": "2026-05-13T17:22:06.096Z",
  //       "max_allowed": 0,
  //       "img": "string",
  //       "last_login": "2026-05-13T17:22:06.096Z",
  //       "is_verified": true
  //     }
  //   ]
  // }
}

export default {
  getMe,
  fetchBookmarks
}