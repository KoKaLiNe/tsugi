<template>
    <router-link :to="{ name: RouterEnum.Schedule, query: { day: toDateKey(day) } }" replace class="schedule-grid__btn"
        :class="{ '--today': isToday(day), '--selected-day': isSelectedDay(day) }">
        <n-badge class="episode-count" :value="items.length" color="var(--success)" />

        <n-flex :size="0" vertical align="center" wrap>
            <n-text depth="3" class="week-name">{{ day.format("dd") }}</n-text>
            <n-text strong class="week-date">{{ day.format("D") }}</n-text>
        </n-flex>
    </router-link>
</template>

<script lang="ts" setup>
import type { AiringSchedulesFragment } from '@/api/generated/graphql';
import { useNow } from '@/composables/useNow';
import { RouterEnum } from '@/router';
import { toDateKey } from '@/utils/dates';
import dayjs from 'dayjs';

interface IProps {
    loading?: boolean;
    error?: string;
    day: dayjs.Dayjs;
    items: AiringSchedulesFragment[];
    selectedDay: string;
}

const props = withDefaults(defineProps<IProps>(), {
    loading: true
})

const now = useNow()

const isToday = (date: dayjs.Dayjs) => dayjs(now.value).startOf('day').isSame(date.startOf('day'))
const isSelectedDay = (date: dayjs.Dayjs) => dayjs(props.selectedDay).startOf('day').isSame(date.startOf('day'))
</script>

<style lang="scss" scoped>
.schedule-grid__btn {
    display: block;
    width: 100%;
    height: 100%;
    text-align: center;
    font-size: 14px;
    border: $base-border;
    border-radius: $base-border-radius;
    padding: $base-padding;
    background-color: var(--surface);
    box-shadow: 0px 5px 8px -1px color-mix(in srgb, var(--border) 100%, transparent);
    position: relative;

    &:hover {
        box-shadow: $card-shadow-hover;
    }

    .week-date {
        font-size: 16px;
    }

    .episode-count {
        position: absolute;
        top: -4px;
        right: -4px;

        :deep(.n-badge-sup) {
            color: var(--on-success);
        }
    }


    &.--selected-day {
        border: 1px solid color-mix(in srgb, var(--accent) 50%, transparent);
        background-color: var(--accent-bg);
    }

    &.--today {
        .week-name {
            color: var(--accent-text);
        }

        .week-date {
            color: var(--accent-text-strong);
        }

        border-bottom: 5px solid color-mix(in srgb, var(--accent) 80%, transparent);
    }
}
</style>
