import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { graphqlRequest } from "@/api/request";
import { search } from "@/api/gql/requests";
import type { GetSearchListQuery, GetSearchListQueryVariables, SearchListMediaFragment } from "@/api/generated/graphql";
import { AxiosError } from "axios";
import { useAbortController } from "@/composables/useAbortController";

export const useSearchListStore = defineStore('searchList', () => {
    const { isCurrentController, clearAbortController, getAbortController } = useAbortController()
    
    const list = ref<SearchListMediaFragment[]>([])
    /* filter.search undefined — ещё не загружали; null занят каталогом (поиск без q), поэтому начальное значение не должно с ним совпадать, иначе проверка в SearchView не запустит первую загрузку */
    const filter = reactive<{
        search?: string | null
    }>({})
    const page = ref(1)
    const perPage = ref(20)
    const hasNextPage = ref(false)
    const total = ref(0)

    const loading = ref(false)
    const error = ref(false)

    const loadingMore = ref(false)
    const errorMore = ref(false)

    async function fetchSearchList() {
        const searchController = getAbortController();

        list.value = []
        error.value = false
        errorMore.value = false
        loading.value = true;
        loadingMore.value = false
        hasNextPage.value = false

        try {
            const data = await graphqlRequest<GetSearchListQuery, GetSearchListQueryVariables>(search, { page: page.value, perPage: perPage.value, ...filter }, { signal: searchController.signal })

            if (data) {
                list.value = list.value.concat((data.Page?.media ?? []).filter((option) => !!option));
                hasNextPage.value = data.Page?.pageInfo?.hasNextPage ?? false
                total.value = data.Page?.pageInfo?.total ?? 0
            }
        } catch (err) {
            if (err instanceof AxiosError && err.code === "ERR_CANCELED") {
                return
            }
            error.value = true
        } finally {
            if (isCurrentController(searchController)) {
                loading.value = false;
                clearAbortController()
            }
        }
    }

    async function fetchSearchListMore() {
        const searchController = getAbortController();

        errorMore.value = false
        loadingMore.value = true
        const newPage = page.value + 1

        try {
            const data = await graphqlRequest<GetSearchListQuery, GetSearchListQueryVariables>(search, { page: newPage, perPage: perPage.value, ...filter }, { signal: searchController.signal })

            if (data) {
                list.value = list.value.concat((data.Page?.media ?? []).filter((option) => !!option));
                page.value = newPage
                hasNextPage.value = data.Page?.pageInfo?.hasNextPage ?? false
                total.value = data.Page?.pageInfo?.total ?? 0
            }
        } catch (err) {
            if (err instanceof AxiosError && err.code === "ERR_CANCELED") {
                return
            }
            errorMore.value = true
        } finally {
            if (isCurrentController(searchController)) {
                loadingMore.value = false
                clearAbortController()
            }
        }
    }

    return { loading, loadingMore, error, errorMore, list, filter, page, hasNextPage, fetchSearchList, fetchSearchListMore }
})
