import { api } from '../utils/api'

export const fishHealthService = {
  getAll: () => api.get('/fish-healths'),
  getById: (id) => api.get(`/fish-healths/${id}`),
  create: (healthData) => api.post('/fish-healths', healthData),
  update: (id, healthData) => api.put(`/fish-healths/${id}`, healthData),
  delete: (id) => api.delete(`/fish-healths/${id}`),
}

