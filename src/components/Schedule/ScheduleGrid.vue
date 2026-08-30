<template>
    <n-empty v-if="currentWeekData?.error && !currentWeekData?.loading" :description="t('veiws.schedule.dataLost')"
        size="huge">
        <template #icon>
            <n-icon :component="BrokenImageFilled" />
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
                    <n-skeleton v-if="currentWeekData?.loading ?? true" height="200px" width="100%" :sharp="false" />

                    <template v-else-if="!isEmpty(items)">
                        <ReliseEpisodeCard v-for="item in items" :key="item.id" :episode="item" />
                    </template>

                    <n-text v-else align="center" depth="3"> {{ t("veiws.schedule.noReleases") }} </n-text>
                </n-flex>
            </n-grid-item>
        </n-grid>
    </n-flex>

    <n-flex v-else class="schedule-day-grid__wrapper" vertical :size="8">
        <n-flex v-if="currentWeekData?.loading ?? true">
            <n-grid x-gap="8" y-gap="8" cols="1 650:2">
                <n-grid-item v-for="el in skeletonArray" :key="el" class="schedule-grid__content-item">
                    <n-skeleton height="120px" width="100%" :sharp="false" />
                </n-grid-item>
            </n-grid>
        </n-flex>

        <n-grid v-else-if="!isEmpty(currentDayItems)" class="schedule-week-grid__content" x-gap="8" y-gap="8"
            cols="1 650:2">
            <n-grid-item v-for="item in currentDayItems" :key="item.id" class="schedule-grid__content-item">
                <ReliseEpisodeCard :episode="item" direction="row" />
            </n-grid-item>
        </n-grid>
        <n-text v-else align="center" depth="3"> {{ t("veiws.schedule.noReleases") }} </n-text>
    </n-flex>
</template>

<script lang="ts" setup>
import { isEmpty } from "lodash-es"
import { useI18n } from "vue-i18n";
import { type IAiringSchedulesData } from "@/stores/schedule";
import dayjs from "dayjs";
import { BrokenImageFilled } from "@vicons/material"
import ReliseEpisodeCard from "@/components/Schedule/ReliseEpisodeCard.vue"
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
