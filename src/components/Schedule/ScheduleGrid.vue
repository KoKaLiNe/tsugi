<template>
    <n-empty v-if="currentWeekData?.error && !currentWeekData?.loading" :description="t('views.schedule.dataLost')"
        size="huge">
        <template #icon>
            <n-icon :component="BrokenImageRound" />
        </template>

        <template #extra>
            <n-button @click="emits('reloadData')">
                {{ t("common.reloadData") }}
            </n-button>
        </template>
    </n-empty>

    <n-flex v-if="isWideLayout" class="schedule-grid__wrapper" vertical :size="0">
        <n-grid class="schedule-week-grid__content" x-gap="8" :cols="7">
            <n-grid-item v-for="{ day, items } in week" :key="day.valueOf()" class="schedule-grid__content-item">
                <n-flex v-if="!currentWeekData?.error" :size="8" vertical>
                    <template v-if="!isEmpty(items)">
                        <ReleaseEpisodeCard v-for="item in items" :key="item.id" :episode="item" />
                    </template>

                    <n-skeleton v-else-if="(currentWeekData?.loading ?? true) && !currentWeekData?.data" height="200px"
                        width="100%" :sharp="false" />

                    <n-text v-else align="center" depth="3"> {{ t("views.schedule.noReleases") }} </n-text>
                </n-flex>
            </n-grid-item>
        </n-grid>
    </n-flex>

    <n-flex v-else class="schedule-day-grid__wrapper" vertical :size="8">
        <n-grid v-if="!isEmpty(currentDayItems)" class="schedule-week-grid__content" x-gap="8" y-gap="8" cols="1 650:2">
            <n-grid-item v-for="item in currentDayItems" :key="item.id" class="schedule-grid__content-item">
                <ReleaseEpisodeCard :episode="item" direction="row" />
            </n-grid-item>
        </n-grid>

        <n-flex v-else-if="(currentWeekData?.loading ?? true) && !currentWeekData?.data">
            <n-grid x-gap="8" y-gap="8" cols="1 650:2">
                <n-grid-item v-for="el in skeletonArray" :key="el" class="schedule-grid__content-item">
                    <n-skeleton height="120px" width="100%" :sharp="false" />
                </n-grid-item>
            </n-grid>
        </n-flex>

        <n-text v-else-if="!currentWeekData?.error" align="center" depth="3"> {{ t("views.schedule.noReleases") }}
        </n-text>
    </n-flex>
</template>

<script lang="ts" setup>
import { isEmpty } from "lodash-es"
import { useI18n } from "vue-i18n";
import { type IAiringSchedulesData } from "@/stores/schedule";
import dayjs from "dayjs";
import { BrokenImageRound } from "@vicons/material"
import ReleaseEpisodeCard from "@/components/Schedule/ReleaseEpisodeCard.vue"
import type { AiringSchedulesFragment } from "@/api/generated/graphql";
import { computed } from "vue";
import { toDateKey } from "@/utils/dates";

const { t } = useI18n()

interface IEmits {
    (e: 'reloadData'): void
}
const emits = defineEmits<IEmits>()

interface IProps {
    isWideLayout: boolean;
    week: Array<{
        day: dayjs.Dayjs;
        items: AiringSchedulesFragment[];
    }>;
    currentWeekData?: IAiringSchedulesData;
    selectedDay: string
}

const props = defineProps<IProps>()

const currentDayItems = computed(() => props.week.find((data) => toDateKey(data.day) === props.selectedDay)?.items ?? [])

const skeletonArray = Array.from({ length: 2 }).map((_, index) => index)
</script>

<style lang="scss" scoped>
.schedule {
    &-week-grid {
        &__content {
            margin-top: $base-gap;
        }
    }
}
</style>
