import i18n from "@/locales";
import axios, { AxiosError } from "axios"
import { createDiscreteApi } from "naive-ui"

const t = i18n.global.t

const API_URL = 'https://graphql.anilist.co'

const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
})

const { message } = createDiscreteApi(['message']);

api.interceptors.response.use(
    (response) => {
        const errors = response.data?.errors

        if (errors?.length) {
            return Promise.reject(new Error(errors[0].message))
        }

        return response
    },
    (error: AxiosError) => {
        const statusCode = error.response?.status
        console.error("error", error.response?.headers["x-ratelimit-reset"]);

        let errorText: string

        switch (statusCode) {
            case 429:
                errorText = t(`error.networkError.${statusCode}`)
                break;

            default:
                errorText = t(`error.general`)
                break;
        }

        message.error(errorText, {
            closable: true,
            duration: 5000
        })

        return Promise.reject(error)
    }
)

export default api
