import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

const unwrap = (payload) => (payload && typeof payload === 'object' && 'data' in payload ? payload.data : payload)

export const fetchUserAchievements = (userId) =>
  api.get(`/users/${userId}/achievements`).then((res) => unwrap(res.data))

export const fetchUsers = () =>
  api.get('/users').then((res) => {
    const users = unwrap(res.data)
    return Array.isArray(users) ? users : []
  })

export const recordPurchase = (userId, amount, description = '') =>
  api
    .post(`/users/${userId}/purchases`, { amount, description })
    .then((res) => unwrap(res.data))
