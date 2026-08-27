<template>
    <n-flex class="schedule" vertical :size="8">
        <n-flex class="schedule-header" justify="space-between">
            <n-text class="schedule-title">
                <n-h3>{{ t("veiws.schedule.title") }}</n-h3>
                {{ weekRangeText }}
            </n-text>

            <n-flex class="schedule-controls" :size="8">
                <n-button @click="goTo('prev')">
                    <n-icon :component="ArrowBackIosNewFilled" />
                </n-button>

                <!-- <n-date-picker type="week" clearable /> -->
                <n-button :disabled="isCurrentDay" @click="goTo('today')">
                    {{ t("common.today") }}
                </n-button>

                <n-button @click="goTo('next')">
                    <n-icon :component="ArrowForwardIosFilled" />
                </n-button>
            </n-flex>
        </n-flex>

        <n-flex class="week-day__wrapper" vertical>
            <n-grid class="week-day" x-gap="8" :cols="7">
                <n-gi v-for="{ day, items } in week" :key="day.valueOf()">
                    <n-flex class="schedule-grid" :size="8" vertical>
                        <n-flex class="schedule-grid__header" :class="{ '--today': isToday(day) }" :size="0" vertical
                            align="center" wrap>
                            <n-text depth="3">{{ day.format("dd") }}</n-text>
                            <n-text strong>{{ day.format("D") }}</n-text>
                        </n-flex>

                        <n-flex v-if="!currentWeekData?.error" :size="8" vertical class="schedule-grid__content">
                            <n-skeleton v-if="currentWeekData?.loading ?? true" height="200px" width="100%"
                                :sharp="false" />

                            <template v-else-if="!isEmpty(items)">
                                <ReliseEpisodeCard v-for="item in items" :key="item.id" :episode="item"
                                    :isCurrentWeek="isCurrentWeek" />
                            </template>

                            <n-text v-else align="center" depth="3"> {{ t("veiws.schedule.noReleases") }} </n-text>
                        </n-flex>
                    </n-flex>
                </n-gi>
            </n-grid>

            <n-empty v-if="currentWeekData?.error && !currentWeekData?.loading"
                :description="t('veiws.schedule.dataLost')" size="huge">
                <template #icon>
                    <n-icon :component="BrokenImageFilled" />
                </template>

                <template #extra>
                    <n-button @click="reloadData">
                        {{ t("common.reloadData") }}
                    </n-button>
                </template>
            </n-empty>
        </n-flex>

        <n-back-top :right="28" :bottom="8">
            <n-icon :component="KeyboardArrowUpFilled" size="30" />
        </n-back-top>
    </n-flex>
</template>

<script lang="ts" setup>
import { useScheduleStore } from '@/stores/schedule';
import { getWeekDays, getWeekRange, toDateKey, getStartOfWeekDate } from '@/utils/dates';
import { computed } from 'vue';
import { BrokenImageFilled, ArrowBackIosNewFilled, ArrowForwardIosFilled, KeyboardArrowUpFilled } from "@vicons/material"
import { storeToRefs } from 'pinia';
import ReliseEpisodeCard from "@/components/ReliseEpisodeCard.vue"
import { groupBy, isEmpty } from "lodash-es"
import dayjs from 'dayjs';
import { useRouter } from 'vue-router';
import { RouterEnum } from '@/router';
import { useI18n } from 'vue-i18n';
import { useNow } from '@/composables/useNow';

const { t } = useI18n()
const now = useNow()
const router = useRouter()

const scheduleStore = useScheduleStore()
const { selectedDay, selectedWeek, airingSchedules } = storeToRefs(scheduleStore)

const weekRange = computed(() => getWeekRange(selectedWeek.value))
const weekRangeText = computed(() => {
    const start = dayjs.unix(weekRange.value.start).format("DD MMMM")
    const end = dayjs.unix(weekRange.value.end - 1).format("DD MMMM")
    return `${start} — ${end}`
})

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

const isCurrentWeek = computed(() => getStartOfWeekDate(selectedWeek.value).isSame(getStartOfWeekDate(now.value)))
const isCurrentDay = computed(() => dayjs(selectedDay.value).startOf("day").isSame(dayjs(now.value).startOf("day")))

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

<style lang="scss" scoped>
.schedule {
    &-grid {
        &__header {
            border: $base-border;
            border-radius: $base-border-radius;
            padding: $base-padding;
            // position: sticky;
            // top: 0;
            background-color: var(--surface);

            &.--today {
                border: 1px solid color-mix(in srgb, var(--accent) 50%, transparent);
                background-color: var(--accent-bg);
            }
        }
    }

    &-title h3 {
        display: inline;
        margin-right: $base-gap;
    }
}
</style>
