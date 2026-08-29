<template>
    <router-link class="episode" :class="{ '--aired': isAired, 'episode-row': isRowDirection }"
        :to="{ name: RouterEnum.Anime, params: { id: episode.media?.id } }">
        <div class="episode-img__wrapper" :style="episodeStyle">
            <img class="episode-img"
                :src="episode.media?.coverImage?.extraLarge ? episode.media.coverImage?.extraLarge : undefined"
                :alt="episodeTitle" loading="lazy">
        </div>

        <n-flex class="episode-info__wrapper" vertical :size="8" :justify="isRowDirection ? 'space-between' : 'start'">
            <n-flex :size="8" vertical>
                <n-text strong>{{ episodeTitle }}</n-text>
                <n-text>{{ t("common.episodeShort") }} {{ episode.episode }}</n-text>
            </n-flex>

            <n-flex class="episode-time__wrapper" justify="space-between" :size="8">
                <n-flex :size="2" align="center" :wrap="false" v-if="isAired">
                    <n-text depth="3" class="episode__released">
                        <n-icon>
                            <DoneRound />
                        </n-icon>
                        {{ t("veiws.schedule.released") }}
                    </n-text>
                </n-flex>

                <n-flex v-else-if="isCurrentDay" class="episode__release-time" :size="4" align="center" :wrap="false">
                    <n-icon>
                        <AccessTimeRound />
                    </n-icon>

                    <n-text> {{ t("common.dateTime.in") }} </n-text>
                    <n-text v-if="hoursLeft > 0"> {{ hoursLeft }} {{ t("common.dateTime.hour") }} </n-text>
                    <n-text v-if="minutesLeft > 0"> {{ minutesLeft }} {{ t("common.dateTime.min") }} </n-text>
                </n-flex>

                <div>
                    <n-text>{{ airingTime }}</n-text>
                </div>
            </n-flex>
        </n-flex>
    </router-link>
</template>

<script lang="ts" setup>
import type { AiringSchedulesFragment } from '@/api/generated/graphql';
import { RouterEnum } from '@/router';
import { getMediaTitle } from '@/utils/media';
import dayjs from 'dayjs';
import { computed, type StyleValue } from 'vue';
import { useI18n } from 'vue-i18n';
import { DoneRound, AccessTimeRound } from "@vicons/material"
import { useNow } from '@/composables/useNow';

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
const episodeStyle = computed(() => (<StyleValue>{
    backgroundColor: props.episode.media?.coverImage?.color ?? undefined
}))

const isAired = computed(() => dayjs.unix(props.episode.airingAt).isSameOrBefore(dayjs(now.value)))
const isCurrentDay = computed(() => dayjs.unix(props.episode.airingAt).isSame(dayjs(now.value), "day"))

const airingTime = computed(() => dayjs.unix(props.episode.airingAt).format("HH:mm"))
const airingTimeDiff = computed(() => dayjs.duration(props.episode.airingAt * 1000 - now.value))
const totalMinutesLeft = computed(() => Math.ceil(airingTimeDiff.value.asMinutes()))
const hoursLeft = computed(() => Math.floor(totalMinutesLeft.value / 60))
const minutesLeft = computed(() => totalMinutesLeft.value % 60)
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

    &-img {
        width: 100%;
        height: 100%;
        object-fit: cover;

        &__wrapper {
            aspect-ratio: 2 / 3;
            overflow: hidden;
            border-radius: $base-border-radius;
            margin-bottom: $base-gap;
        }
    }

    &__release-time {
        * {
            color: var(--accent-text);
        }
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
            &-img {
                &__wrapper {
                    margin-bottom: 0;
                    max-height: 85px;
                }
            }

            &-info__wrapper {
                flex: 1;
            }
        }

        &.--aired {
            border-right: 5px solid var(--success);
        }
    }
}
</style>