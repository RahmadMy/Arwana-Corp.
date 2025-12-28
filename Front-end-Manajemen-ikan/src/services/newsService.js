import { api } from '../utils/api'

export const newsService = {
  getAll: () => api.get('/news'),
  getById: (id) => api.get(`/news/${id}`),
  getPublished: () => api.get('/news/published'),
  create: (data) => api.post('/news', data),
  update: (id, data) => api.put(`/news/${id}`, data),
  delete: (id) => api.delete(`/news/${id}`),
}