import api from "./api";

export async function reserveBookStudent(bookId) {
  let data = await api.post(`/reservations/create_for_student/`, { book: bookId })
  return data
}

export async function reserveBookReservationStudent(bookId) {
  let data = await api.post(`/reservations/cancel_for_student/`, { book: bookId })
  return data
}

export default {
  reserveBookStudent,
  reserveBookReservationStudent
}