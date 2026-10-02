<template>
    <router-link class="episode" :class="{ '--aired': isAired, 'episode-row': isRowDirection }"
        :to="{ name: RouterEnum.Anime, params: { id: episode.media?.id } }">

        <TitleImage :src="episode.media?.coverImage?.extraLarge ? episode.media.coverImage?.extraLarge : undefined"
            :title="episode.media" :alt="episodeTitle" :size="isRowDirection ? 'medium' : undefined" />

        <n-flex class="episode-info__wrapper" vertical :size="8" :justify="isRowDirection ? 'space-between' : 'start'">
            <n-flex :size="8" vertical>
                <n-text strong>{{ episodeTitle }}</n-text>
                <n-text>{{ t("common.episodeShort") }} {{ episode.episode }}</n-text>
            </n-flex>

            <n-flex class="episode-time__wrapper" justify="space-between" :size="8">
                <n-flex :size="2" align="center" :wrap="false" v-if="isAired">
                    <n-text depth="3" class="episode__released">
                        <n-icon :component="DoneRound" />
                        {{ t("views.schedule.released") }}
                    </n-text>
                </n-flex>

                <n-flex v-else-if="isCurrentDay" class="episode__release-time" :size="4" align="center" :wrap="false">
                    <n-icon :component="AccessTimeRound" />
                    <n-text> {{ t("common.dateTime.in") }} {{ timeLeft }}</n-text>
                </n-flex>

                <n-text class="episode__airing-time">{{ airingTime }}</n-text>
            </n-flex>
        </n-flex>
    </router-link>
</template>

<script lang="ts" setup>
import type { AiringSchedulesFragment } from '@/api/generated/graphql';
import { RouterEnum } from '@/router';
import { getMediaTitle } from '@/utils/media';
import dayjs from 'dayjs';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { DoneRound, AccessTimeRound } from "@vicons/material"
import { useNow } from '@/composables/useNow';
import TitleImage from '@/components/TitleImage.vue';
import { getFormattedTimeLeft } from '@/utils/time';

const { t } = useI18n()
const now = useNow()

interface IProps {
    episode: AiringSchedulesFragment;
    direction?: 'column' | 'row'
}
const props = withDefaults(defineProps<IProps>(), {
    direction: 'column'
})

const isRowDirection = computed(() => props.direction === 'row')

const episodeTitle = computed(() => getMediaTitle(props.episode.media))

const isAired = computed(() => dayjs.unix(props.episode.airingAt).isSameOrBefore(dayjs(now.value)))
const isCurrentDay = computed(() => dayjs.unix(props.episode.airingAt).isSame(dayjs(now.value), "day"))

const airingTime = computed(() => dayjs.unix(props.episode.airingAt).format("HH:mm"))
const timeLeft = computed(() => getFormattedTimeLeft(props.episode.airingAt * 1000, now.value))
</script>

<style lang="scss" scoped>
.episode {
    padding: $base-padding;

    background-color: var(--surface);
    border: $base-border;
    border-radius: $base-border-radius;

    cursor: pointer;

    &:hover {
        box-shadow: $card-shadow-hover;
    }

    &__release-time {
        * {
            color: var(--accent-text);
        }
    }

    &__airing-time {
        display: flex;
        flex: 1 0 auto;
        justify-content: flex-end;
        font-size: 16px;
    }

    &__released {
        display: flex;
        gap: $base-gap;
        align-items: center;
        flex-wrap: nowrap;
    }

    &.--aired:not(.episode-row) {
        border-bottom: 5px solid var(--success);
    }

    &-row {
        display: flex;
        flex-direction: row;
        gap: $base-gap;

        .episode {
            &-info__wrapper {
                flex: 1;
            }
        }

        &.--aired {
            border-right: 5px solid var(--success);
        }

        &:not(.--aired) {
            .episode {
                &__airing-time {
                    padding-right: 4px;
                }
            }
        }
    }
}
</style>