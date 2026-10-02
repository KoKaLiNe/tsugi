import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import { graphqlRequest } from "@/api/request";
import { getAnimeById } from "@/api/gql/requests";
import type { AnimeByIdMediaFragment, GetAnimeByIdQuery, GetAnimeByIdQueryVariables } from "@/api/generated/graphql";
import { createDiscreteApi, darkTheme, lightTheme, type ConfigProviderProps } from 'naive-ui'
import { useI18n } from "vue-i18n";
import { AxiosError } from "axios";
import { useRouter } from "vue-router";
import { useThemeStore } from "./theme";
import { DARK_THEME, LIGHT_THEME } from "@/constants/themeVariables";
import { useAbortController } from "@/composables/useAbortController";
import { isNil } from "lodash-es";

const configProviderPropsRef = computed<ConfigProviderProps>(() => {
    const { isDarkTheme } = useThemeStore()

    return {
        theme: isDarkTheme ? darkTheme : lightTheme,
        themeOverrides: isDarkTheme ? DARK_THEME : LIGHT_THEME,
    }
})

const { message } = createDiscreteApi(['message'], {
    configProviderProps: configProviderPropsRef,
    messageProviderProps: { placement: 'bottom-right' },
})


export const useAnimeCardStore = defineStore('animeCard', () => {
    const { isCurrentController, clearAbortController, getAbortController } = useAbortController()
    const router = useRouter()
    const { t } = useI18n()

    const animeCard = ref<AnimeByIdMediaFragment>()
    const loading = ref(false)
    const error = ref<string>()

    watch(() => router.currentRoute.value.params.id, (value) => {
        const id = Array.isArray(value) ? value[0] : value
        const formattedId = Number(id)

        if (formattedId) {
            fetchAnimeById(formattedId)
        } else {
            error.value = '404'
            clearAbortController()
        }
    }, { immediate: true })


    async function fetchAnimeById(id: number, isRetry = false) {
        const searchController = getAbortController();

        error.value = undefined
        loading.value = true
        animeCard.value = undefined

        let needErrorMessage = false

        try {
            const data = await graphqlRequest<GetAnimeByIdQuery, GetAnimeByIdQueryVariables>(getAnimeById, { id }, { signal: searchController.signal })

            if (!isCurrentController(searchController)) {
                return
            }
            if (!isNil(data.Media)) {
                animeCard.value = data.Media
                error.value = undefined
            } else {
                error.value = "404"
            }
        } catch (err) {
            if (err instanceof AxiosError && err.code === "ERR_CANCELED") {
                return
            }
            error.value = err instanceof Error ? err.message : String(err)

            if (err instanceof AxiosError && err.status) {
                error.value = err.status.toString()
            } else {
                needErrorMessage = true
            }

            if (isRetry || needErrorMessage) {
                message.error(t('error.general'))
            }

        } finally {
            if (isCurrentController(searchController)) {
                loading.value = false;
                clearAbortController()
            }
        }
    }

    return { loading, error, animeCard, fetchAnimeById }
})
