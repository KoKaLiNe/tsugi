<template>
  <n-flex class="home-page" vertical :size="26">
    <PageBlock class="today-block" :title="t('views.home.today')"
      :link="{ name: RouterEnum.Schedule, query: { day: toDateKey(now) } }" :link-text="t('views.home.fullSchedule')">
      <template #subTitle>
        <n-flex align="center">
          <n-text depth="3">{{ dayjs(now).format("dddd, D MMMM") }}</n-text>

          <CustomDivider no-margin vertical type="dot" />

          <n-skeleton v-if="(currentWeekData?.loading ?? true) && !currentWeekData?.data" text :sharp="false"
            style="width: 80px" />

          <n-text v-else-if="currentDayScheduleData.length" depth="3">
            {{ t('common.episodePlural', currentDayScheduleData.length) }}
          </n-text>
        </n-flex>
      </template>

      <template #content>
        <n-text v-if="nextRelease" class="next-release">{{ nextRelease }} </n-text>

        <CustomCarousel v-if="(currentWeekData?.loading ?? true) && !currentWeekData?.data" loading :gap="0">
          <template #loadingItem>
            <CarouselEpisodeCard :loading="true" />
          </template>
        </CustomCarousel>

        <CustomResult v-else-if="currentWeekData?.error" size="small" :icon="CloudOffRound"
          :title="t('views.search.actions.search.error.general')">
          <template #footer>
            <n-button size="large" @click="scheduleStore.loadWeek(selectedWeek)">
              {{ t('common.retry') }}
            </n-button>
          </template>
        </CustomResult>

        <div v-else-if="isEmpty(currentDayScheduleData)">
          <n-empty :description="t('views.home.noReleases')" size="huge">
            <template #icon>
              <n-icon :component="EventBusyRound" />
            </template>
          </n-empty>
        </div>

        <CustomCarousel v-else :items="currentDayScheduleData" :scroll-to-index="scrollToIndex" :gap="0">
          <template #contentItem="{ item }">
            <CarouselEpisodeCard :episode="item" :isClosest="item.id === closestTitle?.id" />
          </template>
        </CustomCarousel>
      </template>
    </PageBlock>

    <PageBlock class="popular-block" :title="t('views.home.popularNow')" :link="{ name: RouterEnum.Search }"
      :link-text="t('views.home.fullCatalog')">
      <template #content>
        <template v-if="animeListLoading">
          <n-flex vertical :size="16">
            <n-skeleton :sharp="false" height="300px" />

            <div class="popular-item__wrapper">
              <n-skeleton :repeat="14" :sharp="false" height="250px" />
            </div>
          </n-flex>
        </template>

        <CustomResult v-else-if="animeListError || isEmpty(restPopularAnime)" size="small" :icon="CloudOffRound"
          :title="t('views.search.actions.search.error.general')">
          <template #footer>
            <n-button size="large" @click="store.fetchTopAnime">
              {{ t('common.retry') }}
            </n-button>
          </template>
        </CustomResult>

        <template v-else>
          <n-flex vertical :size="16">
            <router-link v-if="isBannerVisible && firstPopularAnime"
              :to="{ name: RouterEnum.Anime, params: { id: firstPopularAnime.id } }">
              <n-flex class="popular-first__wrapper" vertical :size="8">
                <img class="popular-first__img" :src="firstPopularAnime.bannerImage ?? undefined"
                  :alt="getMediaTitle(firstPopularAnime)" />

                <n-flex class="popular-first__info" align="center">
                  <n-text class="popular-first__title"> {{ getMediaTitle(firstPopularAnime) }}</n-text>

                  <CustomDivider v-if="firstPopularAnime.format" vertical no-margin />
                  <n-text v-if="firstPopularAnime.format">
                    {{ t(`TitleFormatEnum.${firstPopularAnime.format}`) }}
                  </n-text>

                  <CustomDivider v-if="firstPopularAnime.episodes" vertical no-margin />
                  <n-text v-if="firstPopularAnime.episodes">
                    {{ t('common.episodePlural', firstPopularAnime.episodes) }}
                  </n-text>

                  <CustomDivider v-if="firstPopularAnime.averageScore" vertical no-margin />
                  <ScoreTag v-if="firstPopularAnime.averageScore" :score="firstPopularAnime.averageScore" />
                </n-flex>
              </n-flex>
            </router-link>

            <div class="popular-item__wrapper">
              <div v-for="item in restPopularAnime" :key="item.id" class="popular-item">
                <n-flex vertical>
                  <TitleCard :item="item" lazyLoadImg />
                </n-flex>
              </div>
            </div>
          </n-flex>
        </template>
      </template>
    </PageBlock>
  </n-flex>
</template>

<script lang="ts" setup>
import { useAnimeListStore } from "@/stores/animeList";
import { storeToRefs } from "pinia";
import { computed, onMounted } from "vue";
import { getMediaTitle } from "@/utils/media";
import { useNow } from "@/composables/useNow";
import dayjs from "dayjs";
import PageBlock from "@/components/Home/PageBlock.vue";
import { useScheduleStore } from "@/stores/schedule";
import { getClosestDayName, toDateKey } from "@/utils/dates";
import { useI18n } from "vue-i18n";
import { RouterEnum } from "@/router";
import CarouselEpisodeCard from "@/components/Carousel/CarouselEpisodeCard.vue";
import CustomCarousel from "@/components/Carousel/CustomCarousel.vue";
import { findIndex, isEmpty } from "lodash-es";
import ScoreTag from '@/components/ScoreTag.vue';
import { useMediaQuery } from "@/composables/useMediaQuery";
import { EventBusyRound, CloudOffRound } from "@vicons/material"
import CustomDivider from "@/components/CustomDivider.vue";
import type { AiringScheduleWithMedia } from "@/types/AiringScheduleWithMedia";
import TitleCard from "@/components/TitleCard.vue";
import CustomResult from "@/components/CustomResult.vue";

const now = useNow()
const { t } = useI18n()
const isBannerVisible = useMediaQuery("(min-width: 700px)")

const scheduleStore = useScheduleStore()
const { selectedWeek, airingSchedules } = storeToRefs(scheduleStore)
const store = useAnimeListStore();
const { loading: animeListLoading, error: animeListError, topAnimeList } = storeToRefs(store);

const currentWeekData = computed(() => airingSchedules.value.get(selectedWeek.value))
const weekSchedulesWithMedia = computed(() => (currentWeekData.value?.data ?? []).filter((item): item is AiringScheduleWithMedia => !!item.media))
const currentDayScheduleData = computed(() => weekSchedulesWithMedia.value.filter((item) => (dayjs.unix(item.airingAt)).isSame(dayjs(now.value), "day")))
const closestTitle = computed(() => weekSchedulesWithMedia.value.find((title) => dayjs.unix(title.airingAt).isAfter(dayjs(now.value))))
const scrollToIndex = computed(() => {
  const closestIndex = findIndex(currentDayScheduleData.value, { id: closestTitle.value?.id })
  return ~closestIndex ? closestIndex : currentDayScheduleData.value.length - 1
})
const nextRelease = computed(() => {
  let nextReleaseText = `${t("views.home.nextRelease")} — `

  if (closestTitle.value) {
    const closestDayName = getClosestDayName(dayjs.unix(closestTitle.value.airingAt), dayjs(now.value))

    if (closestDayName.dayDifference === 0) {
      return
    } else {
      nextReleaseText += closestDayName.dayName
    }

    nextReleaseText += ` ${t('common.dateTime.at')} ${dayjs.unix(closestTitle.value.airingAt).format("HH:mm")}`

    return nextReleaseText
  } else {
    return
  }
})

const firstPopularAnime = computed(() => topAnimeList.value.find((item) => item.bannerImage))
const restPopularAnime = computed(() => topAnimeList.value.filter((item) => isBannerVisible.value ? firstPopularAnime.value?.id !== item.id : true).slice(0, isBannerVisible.value ? 14 : 15))

onMounted(() => {
  if (isEmpty(topAnimeList.value) || animeListError.value) {
    store.fetchTopAnime();
  }

});
</script>

<style lang="scss" scoped>
.home-page {
  max-width: 1240px;
  margin: 0 auto;
  padding: $base-padding;
}

.today-block {
  .next-release {
    color: var(--accent-text);
    align-self: flex-end;
  }
}

.popular {
  &-first {
    &__wrapper {
      position: relative;
      cursor: pointer;
    }

    &__info {
      position: absolute;
      bottom: 0;
      left: 0;
      margin: $base-gap;
      padding: $base-gap;
      border-radius: $base-border-radius;
      background-color: var(--surface);
    }

    &__img {
      display: block;
      width: 100%;
      height: auto;
      min-height: 280px;
      max-height: 400px;
      object-fit: cover;
      object-position: center;
      border-radius: $base-border-radius;
      background-color: var(--skeleton-bg);
    }

    &__title {
      font-size: 20px;
      font-weight: 600;
    }
  }

  &-item {
    &__wrapper {
      cursor: pointer;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 16px;
    }
  }
}
</style>
