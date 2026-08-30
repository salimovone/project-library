import api from './api';

/**
 * Band qilingan kitoblar ro'yxatini olish.
 * @param {Object} params - Filtrlar (status, search, page, page_size, ordering)
 */
export async function fetchReservations(params = {}) {
  const data = await api.get('/reservations/', { params });
  return data;
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
 * @param {number} id - Reservation ID
 * @param {Object} payload - { status: 'pending'|'approved'|'given'|'returned'|'cancelled', return_date: '...' }
 */
export async function updateReservationStatus(id, payload) {
  const data = await api.patch(`/reservations/${id}/`, payload);
  return data;
}

/**
 * Yangi bandlov yaratish.
 */
export async function createReservation(bookId) {
  const data = await api.post('/reservations/', { book: bookId });
  return data;
}

/**
 * Talaba uchun bandlov yaratish.
 */
export async function reserveBookStudent(bookId) {
  let data = await api.post(`/reservations/create_for_student/`, { book: bookId });
  return data;
}

/**
 * Talaba bandlovini bekor qilish.
 */
export async function reserveBookReservationStudent(bookId) {
  let data = await api.post(`/reservations/cancel_for_student/`, { book: bookId });
  return data;
}

/**
 * Bandlovni bekor qilish / o'chirish.
 */
export async function cancelReservation(id) {
  const data = await api.delete(`/reservations/${id}/`);
  return data;
}

/**
 * Bandlov statistikasi.
 */
export async function fetchReservationStats(bookId) {
  const data = await api.get('/reservation-stats/', { params: { book_id: bookId } });
  return data;
}

export default {
  fetchReservations,
  fetchReservationById,
  updateReservationStatus,
  createReservation,
  cancelReservation,
  reserveBookStudent,
  reserveBookReservationStudent,
  fetchReservationStats
};