import axios, { AxiosError } from "axios"

const API_URL = import.meta.env.PROD ? '/api/anilist' : 'https://graphql.anilist.co'

const api = axios.create({
    baseURL: API_URL,
    timeout: 10_000,
})

api.interceptors.response.use(
    (response) => {
        const errors = response.data?.errors

        if (errors?.length) {
            return Promise.reject(new Error(errors[0].message))
        }

        return response
    },
    (error: AxiosError) => {
        return Promise.reject(error)
    }
)

export default api
