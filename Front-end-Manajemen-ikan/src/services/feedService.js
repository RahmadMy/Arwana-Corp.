import { api } from '../utils/api'

export const feedService = {
  getAll: () => api.get('/feeds'),
  getById: (id) => api.get(`/feeds/${id}`),
  create: (feedData) => api.post('/feeds', feedData),
  update: (id, feedData) => api.put(`/feeds/${id}`, feedData),
  delete: (id) => api.delete(`/feeds/${id}`),
}

