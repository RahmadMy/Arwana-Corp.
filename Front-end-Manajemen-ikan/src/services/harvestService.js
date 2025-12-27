import { api } from '../utils/api'

export const harvestService = {
  getAll: () => api.get('/harvests'),
  getById: (id) => api.get(`/harvests/${id}`),
  create: (harvestData) => api.post('/harvests', harvestData),
  update: (id, harvestData) => api.put(`/harvests/${id}`, harvestData),
  delete: (id) => api.delete(`/harvests/${id}`),
}

