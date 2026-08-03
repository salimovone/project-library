import api from './api';

export async function fetchNotifications(page = 1) {
  const data = await api.get('/notifications/', { params: { page } });
  return data;
}

export async function fetchNotificationById(id) {
  const data = await api.get(`/notifications/${id}/`);
  return data;
}

export async function markNotificationRead(id) {
  const data = await api.post(`/notifications/${id}/mark_read/`);
  return data;
}

export async function markAllNotificationsRead() {
  const data = await api.post('/notifications/mark_all_read/');
  return data;
}

export default {
  fetchNotifications,
  fetchNotificationById,
  markNotificationRead,
  markAllNotificationsRead,
};
