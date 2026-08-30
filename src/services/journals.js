import api from './api';

export async function fetchJournals(params = {}) {
  const data = await api.get('/journals/', { params });
  return data;
}

export async function fetchJournalById(id) {
  const data = await api.get(`/journals/${id}/`);
  return data;
}

export async function createJournal(journalData) {
  const data = await api.post('/journals/', journalData);
  return data;
}

export async function updateJournal(id, journalData) {
  const data = await api.put(`/journals/${id}/`, journalData);
  return data;
}

export async function patchJournal(id, journalData) {
  const data = await api.patch(`/journals/${id}/`, journalData);
  return data;
}

export async function deleteJournal(id) {
  const data = await api.delete(`/journals/${id}/`);
  return data;
}

export default {
  fetchJournals,
  fetchJournalById,
  createJournal,
  updateJournal,
  patchJournal,
  deleteJournal,
};
