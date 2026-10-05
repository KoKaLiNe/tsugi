<template>
    <div v-if="error" class="anime-page --error">
        <NotFound v-if="['400', '404'].includes(error)" :title="t('views.anime.error.404.title')"
            :info="t('views.anime.error.404.info')">
            <template #actions>
                <n-flex>
                    <n-button type="primary" @click="goTo(RouterEnum.Schedule)">
                        {{ t('common.goTo.schedule') }}
                    </n-button>

                    <n-button quaternary type="primary" @click="goTo(RouterEnum.Search)">{{
                        t('views.anime.searchByName') }}</n-button>
                </n-flex>
            </template>
        </NotFound>

        <NotFound v-else :icon="CloudOffRound" :title="t('views.anime.error.general.title')"
            :info="t('views.anime.error.general.info')">
            <template #actions>
                <n-flex>
                    <n-button type="primary" @click="retryFetch">
                        <template #icon>
                            <n-icon :component="RefreshRound" />
                        </template>
                        {{ t('common.retry') }}
                    </n-button>
                    <n-button quaternary type="primary" @click="goTo(RouterEnum.Home)">{{ t('common.goTo.home')
                    }}</n-button>
                </n-flex>
            </template>
        </NotFound>
    </div>

    <div v-else class="anime-page" :class="{ '--wide': isWideLayout }">
        <n-skeleton v-if="loading" class="banner" height="250px" width="100vw" />
        <div v-else class="banner" :style="bannerStyle"> </div>

        <n-flex class="content" vertical :size="16">
            <n-flex class="content__wrapper" :size="24" :wrap="false">
                <n-flex class="content-img__wrapper" align="flex-end">
                    <n-skeleton v-if="loading" class="content-img" height="300px" />

                    <TitleImage v-else-if="animeCard" class="content-img"
                        :src="animeCard.coverImage?.extraLarge ? animeCard.coverImage.extraLarge : undefined"
                        :title="animeCard" :alt="animeTitle" size="extra-large" :style="contentImgStyle" />
                </n-flex>

                <n-flex class="content-title__wrapper" vertical :size="16" justify="center">
                    <n-skeleton v-if="loading" class="content-title" text height="60px" :sharp="false" />

                    <n-flex v-else vertical>
                        <n-h2 class="content-title">{{ animeTitle }}</n-h2>

                        <n-text depth="3">{{ animeSecondaryTitle }} </n-text>
                    </n-flex>


                    <n-flex v-if="loading" :size="8" align="center">
                        <n-skeleton height="28px" width="60px" :sharp="false" />
                        <n-skeleton height="28px" width="45px" :sharp="false" />
                        <n-skeleton height="28px" width="70px " :sharp="false" />
                        <n-skeleton height="28px" width="34px" :sharp="false" />
                    </n-flex>

                    <n-flex v-else-if="animeCard" :size="8" align="center">
                        <n-tag v-if="animeFormat" :color="{ color: 'transparent' }">{{ animeFormat }}</n-tag>
                        <n-tag v-if="animeCard.startDate?.year" :color="{ color: 'transparent' }">
                            {{ animeCard.startDate?.year }}
                        </n-tag>

                        <StatusTag :status="animeCard.status" />

                        <ScoreTag :score="animeCard.averageScore" size="medium" />
                    </n-flex>

                    <n-flex v-if="!loading && animeCard?.nextAiringEpisode?.airingAt" class="next-episode"
                        align="center" :size="16" :wrap="false">
                        <n-icon :component="AccessTimeRound" :size="28" />
                        <n-flex vertical :size="4">
                            <n-text strong class="next-episode__airing-at"> {{ nextEpisodeAiringAt }} </n-text>
                            <n-text class="next-episode__airing-at-day">
                                {{ t('common.dateTime.in') }} {{ nextEpisodeAiringAtInDays }}</n-text>
                        </n-flex>
                    </n-flex>
                </n-flex>
            </n-flex>

            <n-flex :wrap="false" class="content-info" :size="24">
                <n-flex v-if="loading" class="info-table" vertical>
                    <n-flex v-for="(_, index) in Array.from({ length: 5 })" :key="index" vertical>
                        <n-flex class="info-table__item" justify="space-between" align="center" :wrap="false">
                            <n-skeleton height="17px" width="80px" text :sharp="false" />
                            <n-skeleton height="17px" width="80px" text :sharp="false" />
                        </n-flex>

                        <CustomDivider v-if="index !== 5" no-margin />
                    </n-flex>
                </n-flex>

                <n-flex v-else-if="animeCard" class="info-table" vertical>
                    <n-flex v-for="([key, item], index) in cardTableInfoMapped" :key="key" vertical>
                        <n-flex class="info-table__item" justify="space-between" align="center" :wrap="false">
                            <n-text> {{ t(`views.anime.tableInfo.${key}`) }} </n-text>
                            <n-text strong depth="1"> {{ item }} </n-text>
                        </n-flex>

                        <CustomDivider v-if="index !== cardTableInfoMapped.length - 1" no-margin />
                    </n-flex>
                </n-flex>

                <n-flex class="description__wrapper" vertical :size="16">
                    <n-flex v-if="loading" class="description__tags">
                        <n-skeleton v-for="(_, index) in Array.from({ length: 3 })" :key="index" height="28px"
                            width="60px" :sharp="false" />
                    </n-flex>

                    <n-flex v-else-if="animeCard && !isEmpty(animeCard?.genres)" class="description__tags">
                        <n-tag v-for="genre in animeCard.genres" :key="genre"> {{ t(`GenreEnum.${genre}`) }}</n-tag>
                    </n-flex>

                    <n-skeleton v-if="loading" height="100%" :sharp="false" />
                    <n-text v-else-if="animeCard?.description" class="description__text" tag="div" depth="1"
                        :class="{ '--collapsed': isClampedDescription }" ref="descriptionRef" v-html="description">
                    </n-text>

                    <n-button v-if="isShowShowMore" quaternary type="primary" @click="toggleShowMore">
                        {{ isClampedDescription ? t('common.showMore') : t('common.collapse') }}
                    </n-button>
                </n-flex>
            </n-flex>

            <template v-if="!error && slicedAiringScheduleNodes?.length > 1">
                <CustomDivider no-margin />

                <n-flex v-if="animeCard" vertical class="next-episodes">
                    <n-flex justify="space-between" class="next-episodes__closest">
                        <n-h6>{{ t('views.anime.closestReleases') }}</n-h6>

                        <n-text v-if="animeCard.nextAiringEpisode?.episode" tag="div">
                            {{ t('common.released') }} {{ animeCard.nextAiringEpisode.episode - 1 }}
                            <n-text v-if="animeCard.episodes">
                                {{ t('common.of') }} {{ animeCard.episodes }}
                            </n-text>
                        </n-text>
                    </n-flex>

                    <n-flex vertical :size="0">
                        <n-flex v-for="(episode, index) in slicedAiringScheduleNodes" :key="episode?.id"
                            class="next-episodes__list" vertical :size="0">
                            <div v-if="episode" class="episode-schedule__item"
                                :class="{ '--closest': episode.id === closestEpisode?.id }">
                                <n-text tag="div">
                                    {{ t('views.anime.episode').toLocaleLowerCase() }} {{ episode.episode }}
                                </n-text>

                                <n-text tag="div" depth="1">
                                    {{ dayjs.unix(episode.airingAt).format('dddd, D MMMM') }}
                                </n-text>

                                <n-text tag="div" strong depth="1" class="episode-schedule__item-time">{{
                                    dayjs.unix(episode.airingAt).format('HH:mm') }}
                                </n-text>

                                <n-text class="episode-schedule__item-airing-in" tag="div" depth="3">
                                    {{ t('common.dateTime.in') }}
                                    {{ getFormattedTimeLeft(dayjs.unix(episode.airingAt).valueOf(), now, true, true) }}
                                </n-text>
                            </div>

                            <CustomDivider v-if="index" no-margin />
                        </n-flex>

                        <div>
                            <n-button v-if="airingScheduleNodes.length > 4" class="episode-schedule__show-all-btn"
                                quaternary type="primary" @click="isShowAllNextEpisodes = !isShowAllNextEpisodes">
                                {{ isShowAllNextEpisodes
                                    ? t('common.collapse').toLocaleLowerCase()
                                    : t('common.showAll').toLocaleLowerCase() }}
                            </n-button>
                        </div>
                    </n-flex>
                </n-flex>
            </template>
        </n-flex>
    </div>
</template>

<script lang="ts" setup>
import ScoreTag from '@/components/ScoreTag.vue';
import TitleImage from '@/components/TitleImage.vue';
import { useIsWideLayout } from '@/composables/useIsWideLayout';
import { useAnimeCardStore } from '@/stores/animeCard';
import { getMediaTitle, proxyImageUrl } from '@/utils/media';
import { storeToRefs } from 'pinia';
import { computed, onScopeDispose, ref, watch, type CSSProperties } from 'vue';
import { useI18n } from 'vue-i18n';
import { AccessTimeRound, CloudOffRound, RefreshRound } from "@vicons/material"
import { debounce, isEmpty, isNil } from 'lodash-es';
import StatusTag from '@/components/StatusTag.vue';
import CustomDivider from '@/components/CustomDivider.vue';
import dayjs from 'dayjs';
import DOMPurify from 'dompurify';
import { getClosestDayName, formatFuzzyDate } from '@/utils/dates';
import { useNow } from '@/composables/useNow';
import { getFormattedTimeLeft } from '@/utils/time';
import NotFound from '@/components/NotFound.vue';
import { RouterEnum } from '@/router';
import { useRouter } from 'vue-router';

const isWideLayout = useIsWideLayout()
const now = useNow()
const { t } = useI18n()
const router = useRouter()

const animeCardStore = useAnimeCardStore()
const { loading, error, animeCard } = storeToRefs(animeCardStore)

const bannerStyle = computed(() => (<CSSProperties>{
    backgroundImage: animeCard.value?.bannerImage ? `url(${proxyImageUrl(animeCard.value?.bannerImage)})` : undefined,
    backgroundColor: animeCard.value?.coverImage?.color ?? undefined,
    '--cover-color': animeCard.value?.coverImage?.color ?? 'transparent'
}))

const contentImgStyle = computed(() => {
    const color = animeCard.value?.coverImage?.color

    return color
        ? { boxShadow: `0 0 15px 5px color-mix(in srgb, ${color} 40%, transparent)` }
        : {}
})

const animeTitle = computed(() => getMediaTitle(animeCard.value))
const animeSecondaryTitle = computed(() => {
    return [animeCard.value?.title?.romaji, animeCard.value?.title?.native].filter(Boolean).join(" \u00B7 ")
})
const animeFormat = computed(() => animeCard.value?.format ? t(`TitleFormatEnum.${animeCard.value?.format}`) : null)

const nextEpisodeAiringAt = computed(() => {
    let nextEpisodeTime = ""

    if (animeCard.value?.nextAiringEpisode?.airingAt) {
        if (animeCard.value?.nextAiringEpisode.episode) {
            nextEpisodeTime += `${t('views.anime.episode')} ${animeCard.value.nextAiringEpisode.episode}`
        }
        const airingAt = dayjs.unix(animeCard.value.nextAiringEpisode.airingAt)
        const closestDayName = getClosestDayName(airingAt, dayjs(now.value))

        nextEpisodeTime += ` ${t('views.anime.willBeReleased')} ${closestDayName.dayName}, `
        nextEpisodeTime += `${airingAt.format(`${closestDayName.dayDifference ? 'D MMMM' : ''} ${t('common.dateTime.at')} HH:mm`)}`
    }

    return nextEpisodeTime
})
const nextEpisodeAiringAtInDays = computed(() => {
    if (animeCard.value?.nextAiringEpisode?.airingAt) {
        return getFormattedTimeLeft(animeCard.value.nextAiringEpisode.airingAt * 1000, now.value, true, true)
    }
})

const cardTableInfo = computed(() => {
    if (animeCard.value) {
        const result = <Record<string, string | number | null>>{
            studio: animeCard.value.studios?.nodes?.at(0)?.name ?? null,
            episodes: animeCard.value.episodes ?? null,
            duration: animeCard.value.duration ? `${animeCard.value.duration} мин` : null,
            season: animeCard.value.season ? [t(`SeasonEnum.${animeCard.value.season}`), animeCard.value.seasonYear].filter(Boolean).join(" ") : null,
            startDate: formatFuzzyDate(animeCard.value.startDate) ?? null,
            endDate: formatFuzzyDate(animeCard.value.endDate) ?? null,
            source: animeCard.value.source ? t(`SourceEnum.${animeCard.value.source}`) : null,
            popularity: animeCard.value.popularity ? animeCard.value.popularity.toLocaleString() : null,
        }

        for (const key in result) {
            if (isNil(result[key])) {
                delete result[key]
            }
        }

        return result
    } else {
        return {}
    }
})
const cardTableInfoMapped = computed(() => Object.entries(cardTableInfo.value))

const description = computed(() => animeCard.value?.description ? DOMPurify.sanitize(animeCard.value?.description) : null)
const descriptionRef = ref()
const isShowShowMore = ref(false)
const isClampedDescription = ref(true)

function toggleShowMore() {
    isClampedDescription.value = !isClampedDescription.value
}

const setIsShowShowMore = debounce(() => {
    const computedStyle = getComputedStyle(descriptionRef.value.$el)
    const descriptionLinesCount = computedStyle.getPropertyValue("--description-lines")

    isShowShowMore.value = descriptionRef.value.$el.scrollHeight > (parseFloat(descriptionLinesCount) * parseFloat(computedStyle.lineHeight) + 1)
}, 100)
const resizeObserver = new ResizeObserver(setIsShowShowMore)

watch(() => descriptionRef.value,
    (value) => {
        if (value) {
            resizeObserver.observe(value.$el);
        } else {
            resizeObserver.disconnect();
            isShowShowMore.value = false
            setIsShowShowMore.cancel()
        }
    },
    { flush: 'post' }
)

onScopeDispose(() => {
    resizeObserver.disconnect();
    setIsShowShowMore.cancel()
})

const airingScheduleNodes = computed(() => (animeCard.value?.airingSchedule?.nodes ?? []).filter(Boolean))
const isShowAllNextEpisodes = ref(false)
const slicedAiringScheduleNodes = computed(() => airingScheduleNodes.value ? airingScheduleNodes.value.slice(0, isShowAllNextEpisodes.value ? airingScheduleNodes.value.length : 4) : [])
const closestEpisode = computed(() => (slicedAiringScheduleNodes.value ?? []).find((title) => dayjs.unix(title!.airingAt).isAfter(dayjs(now.value))))

function goTo(name: RouterEnum) {
    router.replace({ name })
}

function retryFetch() {
    const formattedId = Number(router.currentRoute.value.params.id)

    if (formattedId) {
        animeCardStore.fetchAnimeById(formattedId, true)
    }
}

</script>

<style lang="scss" scoped>
.anime-page {
    --banner-height: min(20vw, 25vh);

    .banner {
        margin: -8px -8px 0;
        background-position: 50% 35%;
        background-repeat: no-repeat;
        background-size: cover;
        height: var(--banner-height);

        &::after {
            content: "";
            display: block;
            height: 100%;
            width: 100%;
            background: linear-gradient(180deg,
                    transparent 20%,
                    oklch(from var(--cover-color, #000) 0.12 c h / 0.8));
        }
    }

    .content {
        width: 100%;
        max-width: 1240px;
        margin: 0 auto;

        &__wrapper {
            margin-top: calc(var(--banner-height) * -0.64);
        }

        &-img {
            border: $base-border;
            border-radius: $base-border-radius;
        }

        &-title {
            margin: 0;
            margin-top: 10px;

            &__wrapper {
                margin-top: calc(var(--banner-height) * 0.54 + 24px);
                margin-bottom: $base-gap;
                flex: 1 1 auto;
            }
        }
    }

    &.--wide {
        .banner {
            margin-left: -40px;
            margin-right: -40px;
        }
    }

    .next-episode {
        padding: 10px 16px;
        border: 1px solid var(--success);
        background-color: color-mix(in srgb, var(--success) 10%, transparent);
        border-radius: $base-border-radius;
        max-width: 470px;

        * {
            color: var(--success);
        }

        &__airing-at {
            font-size: 16px;
        }
    }

    .info-table {
        flex: 1 1 30%;
        min-width: 250px;
    }

    .description {
        &__wrapper {
            flex: 1 1 70%;
        }

        &__text {
            --description-lines: 8;
            transition: max-height 250ms ease;
            overflow: hidden;
            max-height: fit-content;

            &.--collapsed {
                max-height: calc(var(--description-lines) * 1lh);
            }

            @media (prefers-reduced-motion: reduce) {
                transition-duration: 0.01ms
            }
        }
    }

    .next-episodes {
        .episode {
            &-schedule {
                &__item {
                    display: grid;
                    grid-template-columns: 120px minmax(170px, auto) auto minmax(auto, 180px);

                    padding: 8px 16px;

                    &-time,
                    &-airing-in {
                        text-align: end;
                    }

                    &.--closest {
                        background-color: color-mix(in srgb, var(--success) 10%, transparent);
                        border-radius: $base-border-radius;

                        * {
                            font-weight: 500;
                            color: var(--success);
                        }
                    }
                }

                &__show-all-btn {
                    margin-top: $base-gap;
                }
            }
        }
    }
}
</style>
