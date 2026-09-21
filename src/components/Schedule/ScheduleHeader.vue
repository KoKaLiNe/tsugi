<template>
    <n-flex class="schedule-header" :class="{ '--wide': isWideLayout }" vertical>
        <n-flex class="schedule-header__week-controls" justify="space-between" align="center">
            <n-text class="schedule-header__title">
                <n-h3>{{ t("veiws.schedule.title") }}</n-h3>
                {{ weekRangeText }}
            </n-text>

            <n-flex class="schedule-controls" :size="8">
                <n-button class="schedule-controls__prev" @click="goTo('prev')" size="large">
                    <n-icon :component="ArrowBackIosNewRound" />
                </n-button>

                <!-- <n-date-picker type="week" clearable /> -->
                <n-button class="schedule-controls__today" :disabled="isCurrentDay" @click="goTo('today')" size="large">
                    {{ t("common.today") }}
                </n-button>

                <n-button class="schedule-controls__next" :disabled="isNextBtnDisabled" @click="goTo('next')"
                    size="large">
                    <n-icon :component="ArrowForwardIosRound" />
                </n-button>
            </n-flex>
        </n-flex>

        <n-grid class="schedule-header__day-controls" x-gap="8" :cols="7">
            <n-grid-item v-for="{ day, items } in week" :key="day.valueOf()" class="schedule-grid__header-item">
                <ScheduleDayBtn :loading="currentWeekData?.loading" :error="currentWeekData?.error" :day="day"
                    :items="items" :selectedDay="selectedDay" />
            </n-grid-item>
        </n-grid>
    </n-flex>
</template>

<script lang="ts" setup>
import { getEndOfWeekDate, getWeekRange } from '@/utils/dates';
import dayjs from 'dayjs';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { ArrowBackIosNewRound, ArrowForwardIosRound } from "@vicons/material"
import type { AiringSchedulesFragment } from '@/api/generated/graphql';
import type { IAiringSchedulesData } from '@/stores/schedule';
import { useNow } from '@/composables/useNow';
import ScheduleDayBtn from "@/components/Schedule/ScheduleDayBtn.vue"

const { t } = useI18n()
const now = useNow()

interface IEmits {
    (e: 'goTo', position: "prev" | "today" | "next"): void
}
const emits = defineEmits<IEmits>()

interface IProps {
    isWideLayout: boolean;
    selectedWeek: string;
    selectedDay: string
    week: Array<{
        day: dayjs.Dayjs;
        items: AiringSchedulesFragment[];
    }>;
    currentWeekData?: IAiringSchedulesData;
    maxWeekDay: dayjs.Dayjs
}

const props = defineProps<IProps>()

const isCurrentDay = computed(() => dayjs(props.selectedDay).isSame(dayjs(now.value), "day"))

const isNextBtnDisabled = computed(() => {
    const maxSelectedWeekDay = getEndOfWeekDate(props.selectedWeek).startOf("day")

    return maxSelectedWeekDay.isSameOrAfter(props.maxWeekDay)
})

const weekRange = computed(() => getWeekRange(props.selectedWeek))
const weekRangeText = computed(() => {
    const start = dayjs.unix(weekRange.value.start).format("DD MMMM")
    const end = dayjs.unix(weekRange.value.end - 1).format("DD MMMM")
    return `${start} — ${end}`
})

const goTo = (position: "prev" | "today" | "next") => {
    emits("goTo", position)
}

</script>

<style lang="scss" scoped>
.schedule {
    &-header {
        position: sticky;
        top: calc(var(--header-height) + $base-gap);
        z-index: 9;


        &::before {
            content: "";
            position: absolute;
            top: -$base-gap;
            left: -$base-gap;
            width: calc(100% + $base-gap * 2);
            height: calc(100% + $base-gap);
            background: linear-gradient(0deg, transparent 0, var(--bg) 24px);
            z-index: -1;
        }

        &.--wide {
            &::before {
                left: -$wide-gap;
                width: calc(100% + $wide-gap * 2);
            }
        }

        &__title {
            flex-grow: 15;

            h3 {
                display: inline;
                margin-right: $base-gap;
            }
        }
    }

    &-controls {
        flex-grow: 1;
        flex-shrink: 0;

        &__today {
            flex: 1 0 auto;
        }
    }
}
</style>
