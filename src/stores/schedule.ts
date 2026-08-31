import type { AiringSchedulesFragment, GetScheduleQuery, GetScheduleQueryVariables } from "@/api/generated/graphql";
import { getSchedule } from "@/api/gql/requests";
import { graphqlRequest } from "@/api/request";
import dayjs from "dayjs";
import { defineStore } from "pinia";
import { computed, reactive, watch } from "vue";
import { debounce } from "lodash-es";
import { getWeekRange, toDateKey, getStartOfWeekDate, getEndOfWeekDate } from "@/utils/dates";
import router from '@/router'
import { useNow } from "@/composables/useNow";

const REFRESH_TIME = 900_000 //15 мин

export interface IAiringSchedulesData {
    data?: AiringSchedulesFragment[];
    loading?: boolean;
    error?: string;
    fetchedAt?: number;
}

export const useScheduleStore = defineStore('schedule', () => {
    const now = useNow()
    const maxWeekDay = computed(() => dayjs(now.value).add(6, 'month').startOf('day'))

    const selectedDay = computed<string>(() => {
        const routeQueryDay = router.currentRoute.value.query.day
        const day = Array.isArray(routeQueryDay) ? routeQueryDay.find((item) => dayjs(item, "YYYY-MM-DD", true).isValid()) : routeQueryDay

        if (day && dayjs(day, "YYYY-MM-DD", true).isValid() && dayjs(day, "YYYY-MM-DD", true).isSameOrBefore(maxWeekDay.value)) {
            return toDateKey(day)
        } else {
            return toDateKey()
        }

    })
    const selectedWeek = computed<string>(() => toDateKey(getStartOfWeekDate(selectedDay.value)))

    const airingSchedules = reactive<Map<string, IAiringSchedulesData>>(new Map())

    const debouncedLoadWeek = debounce(loadWeek, 300)

    watch(() => selectedWeek.value, (value) => {
        debouncedLoadWeek(value)
    }, { immediate: true })

    function checkIfNeedLoad(weekKey: string) {
        const cached = airingSchedules.get(weekKey)
        let needLoad = true

        if (cached) {
            if (cached.loading) {
                needLoad = false
            }

            if (cached.data) {
                const isDataFresh = (cached.fetchedAt! + REFRESH_TIME) > Date.now()
                const isPastWeek = getEndOfWeekDate(weekKey).startOf('day').isBefore(dayjs().startOf('day'))

                if (isDataFresh || isPastWeek) {
                    needLoad = false
                }
            }
        }

        return needLoad
    }

    function getOrCreateWeek(weekKey: string): IAiringSchedulesData {
        if (!airingSchedules.has(weekKey)) {
            airingSchedules.set(weekKey, {})
        }

        return airingSchedules.get(weekKey)!
    }

    async function loadWeek(weekKey: string) {
        if (!checkIfNeedLoad(weekKey)) {
            return
        }

        const record = getOrCreateWeek(weekKey)
        record.loading = true

        try {
            const { start, end } = getWeekRange(weekKey)
            const airingSchedulesRaw = await fetchAllPages(start, end)
            const validData = (airingSchedulesRaw ?? []).filter((item) => !!item && !item.media?.isAdult) as AiringSchedulesFragment[]

            record.data = validData
            record.fetchedAt = Date.now()
            record.error = undefined
        } catch (error) {
            if (!record.data) {
                record.error = error instanceof Error ? error.message : String(error)
            }
        } finally {
            record.loading = false
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
        maxWeekDay,
        selectedDay,
        selectedWeek,
        airingSchedules,
        loadWeek
    }
})
