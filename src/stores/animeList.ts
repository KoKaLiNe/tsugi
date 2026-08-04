import { defineStore } from "pinia";
import { ref } from "vue";
import { graphqlRequest } from "@/api/request";
import { getTopAnime } from "@/api/gql/requests";
import type { AnimeCardMediaFragment, GetTopAnimeQuery, GetTopAnimeQueryVariables } from "@/api/generated/graphql";
import { isNull } from "lodash-es"

export const useAnimeListStore = defineStore('animeList', () => {
    const topAnimeList = ref<AnimeCardMediaFragment[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)
    const page = ref(1)
    const perPage = ref(20)

    async function fetchTopAnime() {
        loading.value = true
        error.value = null

        try {
            const data = await graphqlRequest<GetTopAnimeQuery, GetTopAnimeQueryVariables>(getTopAnime, { page: page.value, perPage: perPage.value })

            if (data.Page?.media) {
                topAnimeList.value = data.Page.media.filter((media) => !isNull(media))
            }
        } catch (err) {
            error.value = err instanceof Error ? err.message : String(err)
        } finally {
            loading.value = false
        }
    }

    return { loading, error, topAnimeList, fetchTopAnime }
})
