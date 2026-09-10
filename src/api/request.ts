import api from '@/api/client'
import type { AxiosRequestConfig } from 'axios'

export async function graphqlRequest<TResult, TVariables>(
    query: string,
    variables?: TVariables,
    config?: AxiosRequestConfig<any>
): Promise<TResult> {
    const { data } = await api.post('', { query, variables }, config)

    return data.data as TResult
}