import { api } from '../utils/api'

export const feedingScheduleService = {
  getAll: () => api.get('/feeding-schedules'),
  getById: (id) => api.get(`/feeding-schedules/${id}`),
  create: (scheduleData) => api.post('/feeding-schedules', scheduleData),
  update: (id, scheduleData) => api.put(`/feeding-schedules/${id}`, scheduleData),
  delete: (id) => api.delete(`/feeding-schedules/${id}`),
}

