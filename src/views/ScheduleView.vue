<template>
    <n-flex class="schedule-page" vertical :size="8">
        <ScheduleHeader :isWideLayout="isWideLayout" :maxWeekDay="maxWeekDay" :selectedWeek="selectedWeek" :week="week" :currentWeekData="currentWeekData"
            :selectedDay="selectedDay" @goTo="goTo" />

        <ScheduleGrid :isWideLayout="isWideLayout" :week="week" :currentWeekData="currentWeekData"
            :selectedDay="selectedDay" @reloadData="reloadData" />

        <n-back-top :right="60" :bottom="16" :visibility-height="540">
            <n-icon :component="KeyboardArrowUpRound" size="30" />
        </n-back-top>
    </n-flex>
</template>

<script lang="ts" setup>
import { useScheduleStore } from '@/stores/schedule';
import { getWeekDays, toDateKey } from '@/utils/dates';
import { computed } from 'vue';
import { KeyboardArrowUpRound } from "@vicons/material"
import { storeToRefs } from 'pinia';
import ScheduleHeader from "@/components/Schedule/ScheduleHeader.vue"
import ScheduleGrid from "@/components/Schedule/ScheduleGrid.vue"
import { groupBy } from "lodash-es"
import dayjs from 'dayjs';
import { useRouter } from 'vue-router';
import { RouterEnum } from '@/router';
import { useIsWideLayout } from '@/composables/useIsWideLayout';

const isWideLayout = useIsWideLayout()
const router = useRouter()

const scheduleStore = useScheduleStore()
const { maxWeekDay, selectedDay, selectedWeek, airingSchedules } = storeToRefs(scheduleStore)

const weekDays = computed(() => getWeekDays(selectedWeek.value))
const currentWeekData = computed(() => airingSchedules.value.get(selectedWeek.value))

const weekDataGroupedByDay = computed(() => groupBy(currentWeekData.value?.data ?? [], (item) => {
    return toDateKey(dayjs.unix(item.airingAt))
}))
const week = computed(() => {
    return weekDays.value
        .map((day) => ({
            day,
            items: weekDataGroupedByDay.value[toDateKey(day)] ?? []
        }))
})

const reloadData = async () => {
    await scheduleStore.loadWeek(selectedWeek.value)
}

const goTo = (position: "prev" | "today" | "next") => {
    let newDay = selectedDay.value

    switch (position) {
        case "prev":
            newDay = toDateKey(dayjs(selectedDay.value).add(-1, "week"))

            break;
        case "next":
            newDay = toDateKey(dayjs(selectedDay.value).add(1, "week"))

            break;

        default:
            newDay = toDateKey(dayjs())
            break;
    }

    router.push({ name: RouterEnum.Schedule, query: { day: newDay } })
}
</script>
