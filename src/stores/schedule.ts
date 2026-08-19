import type { AiringSchedulesFragment, GetScheduleQuery, GetScheduleQueryVariables } from "@/api/generated/graphql";
import { getSchedule } from "@/api/gql/requests";
import { graphqlRequest } from "@/api/request";
import dayjs from "dayjs";
import { defineStore } from "pinia";
import { computed, reactive, watch } from "vue";
import { debounce } from "lodash-es";
import { getWeekRange, toDateKey } from "@/utils/dates";
import router from '@/router'

interface IAiringSchedulesData {
    data?: AiringSchedulesFragment[];
    loading?: boolean;
    error?: string;
}

export const useScheduleStore = defineStore('schedule', () => {
    const currentWeek = computed(() => router.currentRoute.value.query.week as string ?? toDateKey(dayjs().startOf("isoWeek")))

    const airingSchedules = reactive<Map<string, IAiringSchedulesData>>(new Map())

    const debouncedLoadWeek = debounce(loadWeek, 300)

    watch(() => currentWeek.value, (value) => {
        debouncedLoadWeek(value)
    }, { immediate: true })

    async function loadWeek(weekKey: string) {
        const cached = airingSchedules.get(weekKey)

        if (cached && (!cached.error || cached.loading)) {
            /* TODO логика отображения кэша и перезапроса по необходимости */
            return
        } else {
            airingSchedules.set(weekKey, {
                data: [],
                loading: true,
            })

            try {
                const { start, end } = getWeekRange(weekKey)
                const airingSchedulesRaw = await fetchAllPages(start, end)

                const validData = (airingSchedulesRaw ?? []).filter((item) => !!item)
                airingSchedules.get(weekKey)!.data = validData

            } catch (error) {
                airingSchedules.get(weekKey)!.error = error instanceof Error ? error.message : String(error)
            } finally {
                airingSchedules.get(weekKey)!.loading = false
            }
        }
    }

    async function fetchAllPages(start: number, end: number) {
        const allPages = <(AiringSchedulesFragment | null)[]>[]
        const dto = {
            start: start - 1,
            end: end,
            page: 1
        }
        let hasNextPage = true

        for (let i = 0; hasNextPage && i < 10; i++) {
            const data = await graphqlRequest<GetScheduleQuery, GetScheduleQueryVariables>(getSchedule, dto)

            if (data?.Page?.airingSchedules) {
                allPages.push(...data.Page.airingSchedules)

                hasNextPage = data?.Page?.pageInfo?.hasNextPage ?? false
                dto.page++
            } else {
                hasNextPage = false
            }
        }
        return allPages
    }

    return {
        currentWeek,
        airingSchedules,
        loadWeek
    }
})
