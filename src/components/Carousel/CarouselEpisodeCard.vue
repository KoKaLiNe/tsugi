<template>
    <router-link :to="{ name: RouterEnum.Anime, params: { id: episode.media?.id } }">
        <n-flex class="episode-card" :class="{ '--closest': isClosest, '--aired': isAired, }" vertical>
            <div class="episode-card__img-wrapper">
                <TitleImage class="episode-card__img"
                    :src="episode.media?.coverImage?.large ? episode.media.coverImage.large : undefined"
                    :title="episode.media" :alt="episodeTitle" />

                <n-flex class="episode-card__info float">
                    <div class="info__number">{{ t("common.episodeShort") }} {{ episode.episode }}</div>

                    <div v-if="!isAired && isClosest" class="info__time">
                        <n-tooltip placement="top" trigger="hover">
                            <template #trigger>
                                <n-text> {{ t("common.dateTime.in") }} {{ timeLeft }}</n-text>
                            </template>

                            {{ dayjs.unix(props.episode.airingAt).format("HH:mm") }}
                        </n-tooltip>
                    </div>

                    <n-text v-else-if="isAired" class="info__time">
                        {{ t("common.released") }}
                        {{ t("common.dateTime.at") }}
                        {{ dayjs.unix(props.episode.airingAt).format("HH:mm") }}
                    </n-text>

                    <n-text v-else class="info__time">{{ dayjs.unix(props.episode.airingAt).format("HH:mm") }}</n-text>
                </n-flex>
            </div>

            <n-text class="episode-card__title" :title="episodeTitle">{{ episodeTitle }}</n-text>
        </n-flex>
    </router-link>
</template>

<script lang="ts" setup>
import type { AiringSchedulesFragment } from '@/api/generated/graphql';
import TitleImage from '../TitleImage.vue';
import { computed } from 'vue';
import { getMediaTitle } from '@/utils/media';
import { RouterEnum } from '@/router';
import dayjs from 'dayjs';
import { useNow } from '@/composables/useNow';
import { useI18n } from 'vue-i18n';
import { getFormattedTimeLeft } from '@/utils/time.ts';

const now = useNow()
const { t } = useI18n()

interface IProps {
    episode: AiringSchedulesFragment;
    isClosest: boolean
}

const props = defineProps<IProps>()

const episodeTitle = computed(() => getMediaTitle(props.episode.media))
const isAired = computed(() => dayjs.unix(props.episode.airingAt).isSameOrBefore(dayjs(now.value)))

const timeLeft = computed(() => getFormattedTimeLeft(props.episode.airingAt * 1000, now.value))
</script>

<style lang="scss" scoped>
.episode-card {
    width: 180px;
    padding: $base-gap;
    cursor: pointer;

    &__img {
        margin-bottom: 0;

        &-wrapper {
            position: relative;
            border: 1px solid transparent;
            border-radius: $base-border-radius;

            &:hover {
                box-shadow: $card-shadow-hover;
            }
        }
    }

    &__title {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        font-weight: 600;
    }

    &__info {
        &.float {
            position: absolute;
            top: 0;
            right: 0;
            width: 100%;
            height: 100%;

            .info {
                &__number {
                    position: absolute;
                    top: 5px;
                    right: 5px;
                    padding: 2px 5px;
                    border-radius: $base-border-radius;
                    background-color: var(--surface);
                    color: var(--text);
                    text-wrap: nowrap;
                }

                &__time {
                    position: absolute;
                    bottom: 5px;
                    left: 5px;
                    padding: 2px 6px;
                    border-radius: $base-border-radius;
                    background-color: var(--surface);
                    color: var(--text);
                    text-wrap: nowrap;
                }
            }
        }
    }

    &.--closest {
        .episode-card__img-wrapper {
            border: 1px solid color-mix(in srgb, var(--accent) 50%, transparent);
            border-radius: $base-border-radius;
        }

        .info__number,
        .info__time {
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
