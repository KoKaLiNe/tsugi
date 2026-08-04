import api from '@/api/client'

export async function graphqlRequest<TResult, TVariables>(
    query: string,
    variables?: TVariables
): Promise<TResult> {
    const { data } = await api.post('', { query, variables })

    return data.data as TResult
}