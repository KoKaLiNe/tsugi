<template>
    <n-flex v-if="loading" class="episode-card" vertical>
        <n-skeleton :sharp="false" height="250px" />
        <n-skeleton text :sharp="false" />
    </n-flex>

    <CoverCard v-else-if="!loading && episode" class="episode-card"
        :class="{ '--closest': isClosest, '--aired': isAired, }" :item="episode.media">
        <template #topRight>
            <div class="episode-card__info-number">{{ t("common.episodeShort") }} {{ episode.episode }}</div>
        </template>

        <template #bottomLeft>
            <div v-if="!isAired && isClosest" class="episode-card__info-time">
                <n-tooltip placement="top" trigger="hover">
                    <template #trigger>
                        <n-text> {{ t("common.dateTime.in") }} {{ timeLeft }}</n-text>
                    </template>

                    {{ dayjs.unix(episode.airingAt).format("HH:mm") }}
                </n-tooltip>
            </div>

            <n-text v-else-if="isAired" class="episode-card__info-time" tag="div">
                {{ t("common.released") }}
                {{ t("common.dateTime.at") }}
                {{ dayjs.unix(episode.airingAt).format("HH:mm") }}
            </n-text>

            <n-text v-else class="episode-card__info-time" tag="div">
                {{ dayjs.unix(episode.airingAt).format("HH:mm") }}
            </n-text>
        </template>
    </CoverCard>
</template>

<script lang="ts" setup>
import type { AiringScheduleWithMedia } from "@/types/AiringScheduleWithMedia";
import { computed } from 'vue';
import dayjs from 'dayjs';
import { useNow } from '@/composables/useNow';
import { useI18n } from 'vue-i18n';
import { getFormattedTimeLeft } from '@/utils/time.ts';
import CoverCard from "@/components/CoverCard.vue";

const now = useNow()
const { t } = useI18n()

interface IProps {
    loading?: boolean;
    episode?: AiringScheduleWithMedia;
    isClosest?: boolean
}

const props = defineProps<IProps>()

const isAired = computed(() => props.episode && dayjs.unix(props.episode.airingAt).isSameOrBefore(dayjs(now.value)))
const timeLeft = computed(() => props.episode && getFormattedTimeLeft(props.episode.airingAt * 1000, now.value))
</script>

<style lang="scss" scoped>
.episode-card {
    width: 180px;
    padding: $base-gap;
    cursor: pointer;

    &__info {
        &-number {
            padding: 2px 5px;
            border-radius: $base-border-radius;
            background-color: var(--surface);
            color: var(--text);
            text-wrap: nowrap;
        }

        &-time {
            padding: 2px 6px;
            border-radius: $base-border-radius;
            background-color: var(--surface);
            color: var(--text);
            text-wrap: nowrap;
        }
    }

    &.--closest {
        :deep(.cover-card__wrapper) {
            border: 1px solid color-mix(in srgb, var(--accent) 50%, transparent);
            border-radius: $base-border-radius;
        }

        .episode-card__info-number,
        .episode-card__info-time {
            background-color: var(--accent);
            color: var(--on-accent);

            * {
                color: var(--on-accent);
            }
        }
    }

    &.--aired {
        opacity: 0.65;
    }
}
</style>
