import { api } from '../utils/api'

export const fishSpeciesService = {
  getAll: () => api.get('/fish-species'),
  getById: (id) => api.get(`/fish-species/${id}`),
  create: (speciesData) => api.post('/fish-species', speciesData),
  update: (id, speciesData) => api.put(`/fish-species/${id}`, speciesData),
  delete: (id) => api.delete(`/fish-species/${id}`),
}

