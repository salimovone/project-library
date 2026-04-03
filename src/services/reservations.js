import api from './api';


export async function reserveBookStudent(bookId) {
  let data = await api.post(`/reservations/create_for_student/`, { book: bookId })
  return data
}

export async function reserveBookReservationStudent(bookId) {
  let data = await api.post(`/reservations/cancel_for_student/`, { book: bookId })
  return data
}

/**
 * Band qilingan kitoblar ro'yxatini olish.
 * @param {Object} params - Filtrlar (status, search, page)
 * @returns {Promise} - Backenddan qaytgan natija
 */
export async function fetchReservations(params = {}) {
  // params: { status: 'pending' | 'borrowed' | 'returned', search: '...' }
  const data = await api.get('/reservations/', { params });
  return data; // results va count bilan qaytadi
}

/**
 * Ma'lum bir bandlov (reservation) tafsilotlarini olish.
 */
export async function fetchReservationById(id) {
  const data = await api.get(`/reservations/${id}/`);
  return data;
}

/**
 * Bandlov holatini (statusini) yangilash.
 * Masalan: pending -> borrowed (Topshirish) yoki borrowed -> returned (Qabul qilish)
 * @param {number} id - Reservation ID
 * @param {Object} payload - { status: '...', return_date: '...' }
 */
export async function updateReservationStatus(id, payload) {
  // Payload ichida status va ixtiyoriy ravishda return_date (qaytarish muddati) bo'ladi
  const data = await api.patch(`/reservations/${id}/`, payload);
  return data;
}

/**
 * Yangi bandlov yaratish (Kitobxon uchun).
 */
export async function createReservation(bookId) {
  const data = await api.post('/reservations/', { book: bookId });
  return data;
}

/**
 * Bandlovni bekor qilish.
 */
export async function cancelReservation(id) {
  const data = await api.delete(`/reservations/${id}/`);
  return data;
}

export default {
  fetchReservations,
  fetchReservationById,
  updateReservationStatus,
  createReservation,
  cancelReservation,
  reserveBookStudent,
  reserveBookReservationStudent
};