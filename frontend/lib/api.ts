import axios from 'axios'
import { auth } from './firebase'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser
  if (user) {
    const token = await user.getIdToken()
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// API methods
export const apiClient = {
  // Auth
  auth: {
    register: (data: any) => api.post('/auth/register', data),
    getProfile: () => api.get('/auth/me'),
    updateProfile: (data: any) => api.put('/auth/profile', data),
  },

  // AI Pricing
  pricing: {
    calculate: (data: any) => api.post('/ai-pricing/calculate', data),
    calculateBatch: (data: any) => api.post('/ai-pricing/batch', data),
    optimize: (data: any) => api.post('/ai-pricing/optimize', data),
  },

  // Tasks
  tasks: {
    create: (data: any) => api.post('/tasks', data),
    getAll: (params?: any) => api.get('/tasks', { params }),
    getById: (id: string) => api.get(`/tasks/${id}`),
    update: (id: string, data: any) => api.put(`/tasks/${id}`, data),
    apply: (id: string, data: any) => api.post(`/tasks/${id}/apply`, data),
    acceptAssignment: (taskId: string, assignmentId: string, accept: boolean) =>
      api.post(`/tasks/${taskId}/assignments/${assignmentId}/accept`, { accept }),
  },

  // Makers
  makers: {
    getAll: (params?: any) => api.get('/makers', { params }),
    getById: (id: string) => api.get(`/makers/${id}`),
    getMyTasks: (params?: any) => api.get('/makers/me/tasks', { params }),
    getEarnings: () => api.get('/makers/me/earnings'),
  },

  // Business
  business: {
    getDashboard: () => api.get('/business/dashboard'),
    getTasks: (params?: any) => api.get('/business/tasks', { params }),
    toggleAnonymous: (isAnonymous: boolean) =>
      api.post('/business/toggle-anonymous', { isAnonymous }),
  },

  // Payments
  payments: {
    createCustomer: () => api.post('/payments/create-customer'),
    createConnectAccount: () => api.post('/payments/create-connect-account'),
    processPayment: (data: any) => api.post('/payments/process-payment', data),
    getBalance: () => api.get('/payments/balance'),
  },
}

export default api
