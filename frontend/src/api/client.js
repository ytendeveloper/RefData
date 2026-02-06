import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

export async function createStructure(data) {
  const res = await api.post('/structures', data);
  return res.data;
}

export async function listStructures(q = '') {
  const res = await api.get('/structures', { params: { q } });
  return res.data;
}

export async function getStructure(id) {
  const res = await api.get(`/structures/${id}`);
  return res.data;
}

export async function addElements(structureId, elements) {
  const res = await api.post(`/structures/${structureId}/elements`, { elements });
  return res.data;
}

export async function searchElements(structureId, q = '') {
  const res = await api.get(`/structures/${structureId}/elements`, { params: { q } });
  return res.data;
}
