import api from '@/api/client'
import type { GglResponse } from '@/types/GraphQL'

export async function graphqlRequest(query: string, variables: Record<string, unknown> = {}) {
    const { data } = await api.post('', { query, variables })

    return data.data as GglResponse
}
