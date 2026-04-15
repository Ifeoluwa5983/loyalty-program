import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

export const fetchUserAchievements = (userId) =>
  api.get(`/users/${userId}/achievements`).then((res) => res.data)

export const fetchUsers = () =>
  api.get('/users').then((res) => res.data)

export const recordPurchase = (userId, amount, description = '') =>
  api
    .post(`/users/${userId}/purchases`, { amount, description })
    .then((res) => res.data)
