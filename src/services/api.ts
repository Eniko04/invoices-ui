/// <reference types="vite/client" />
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://68da7d4b23ebc87faa304fad.mockapi.io',
})

export default api
