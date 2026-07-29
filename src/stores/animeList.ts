import { defineStore } from "pinia";
import { ref } from "vue";
import { graphqlRequest } from "@/api/request";
import { getTopAnime } from "@/api/gql/requests";
import type { IMedia } from "@/types/GraphQL";

export const useAnimeListStore = defineStore('animeList', () => {
    const topAnimeList = ref<IMedia[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)
    const page = ref(1)
    const perPage = ref(20)

    async function fetchTopAnime() {
        loading.value = true
        error.value = null

        try {
            const data = await graphqlRequest(getTopAnime, { page: page.value, perPage: perPage.value })

            topAnimeList.value = data.Page.media
        } catch (err) {
            error.value = err instanceof Error ? err.message : String(err)
        } finally {
            loading.value = false
        }
    }

    return { loading, error, topAnimeList, fetchTopAnime }
})
