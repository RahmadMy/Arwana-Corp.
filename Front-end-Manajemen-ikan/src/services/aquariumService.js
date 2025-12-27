import { api } from '../utils/api'

export const aquariumService = {
  getAll: () => api.get('/aquariums'),
  getById: (id) => api.get(`/aquariums/${id}`),
  create: (aquariumData) => api.post('/aquariums', aquariumData),
  update: (id, aquariumData) => api.put(`/aquariums/${id}`, aquariumData),
  delete: (id) => api.delete(`/aquariums/${id}`),
}

