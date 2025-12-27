import { api } from '../utils/api'

export const fishGrowthService = {
  getAll: () => api.get('/fish-growths'),
  getById: (id) => api.get(`/fish-growths/${id}`),
  create: (growthData) => api.post('/fish-growths', growthData),
  update: (id, growthData) => api.put(`/fish-growths/${id}`, growthData),
  delete: (id) => api.delete(`/fish-growths/${id}`),
}

