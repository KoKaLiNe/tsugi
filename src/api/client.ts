import axios from "axios"

const API_URL = 'https://api.jikan.moe/v4/'

const api = axios.create({
    baseURL: API_URL,
    timeout: 5000,
})

api.interceptors.request.use(
    (response) => response,
    (error) => Promise.reject(error)
)

export default api