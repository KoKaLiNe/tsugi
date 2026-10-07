<template>
  <n-flex class="home" vertical :size="26">
    <PageBlock class="today-block" :title="t('views.home.today')"
      :link="{ name: RouterEnum.Schedule, query: { day: toDateKey(now) } }" :link-text="t('views.home.fullSchedule')">
      <template #subTitle>
        <n-flex>
          <n-text depth="3">{{ dayjs(now).format("dddd, D MMMM") }}</n-text>

          <CustomDivider no-margin vertical />

          <n-skeleton v-if="(currentWeekData?.loading ?? true) && !currentWeekData?.data" text :sharp="false"
            style="width: 80px" />

          <n-text v-else-if="currentDayScheduleData.length" depth="3">
            {{ t('common.episodePlural', currentDayScheduleData.length) }}
          </n-text>
        </n-flex>
      </template>

      <template #content>
        <n-text v-if="nextRelease" class="next-release">{{ nextRelease }} </n-text>

        <!-- TODO сделать скелетон карусели -->
        <n-skeleton v-if="(currentWeekData?.loading ?? true) && !currentWeekData?.data" :sharp="false" height="325px" />

        <CustomCarousel v-else-if="!isEmpty(currentDayScheduleData)" :items="currentDayScheduleData"
          :scroll-to-index="scrollToIndex" :gap="0">
          <template #contentItem="{ item }">
            <CarouselEpisodeCard :episode="item" :isClosest="item.id === closestTitle?.id" />
          </template>
        </CustomCarousel>

        <div v-else>
          <n-empty :description="t('views.home.noReleases')" size="huge">
            <template #icon>
              <n-icon :component="EventBusyRound" />
            </template>
          </n-empty>
        </div>
      </template>
    </PageBlock>

    <!-- TODO сделать первый тайтл рандомным из популярных или тянуть как-то отдельно -->
    <PageBlock class="popular-block" :title="t('views.home.popularNow')" :link="{ name: RouterEnum.Search }"
      :link-text="t('views.home.fullCatalog')">
      <template #content>
        <template v-if="loading">
          <n-flex vertical>
            <n-skeleton :sharp="false" height="300px" />

            <div class="popular-item__wrapper">
              <n-skeleton v-for="index in 9" :key="index" :sharp="false" height="200px" />
            </div>
          </n-flex>

        </template>

        <template v-else>
          <n-flex vertical :size="16">
            <router-link v-if="isBannerVisible && firstPopularAnime"
              :to="{ name: RouterEnum.Anime, params: { id: firstPopularAnime.id } }">
              <n-flex class="popular-first__wrapper" vertical :size="8">
                <img class="popular-first__img" :src="proxyImageUrl(firstPopularAnime.bannerImage)"
                  :alt="getMediaTitle(firstPopularAnime)" />

                <n-flex class="popular-first__info" align="center">
                  <n-text class="popular-first__title"> {{ getMediaTitle(firstPopularAnime) }}</n-text>

                  <CustomDivider vertical />

                  <n-text> {{ firstPopularAnime.format }} </n-text>

                  <CustomDivider vertical />

                  <n-text> {{ t('common.episodePlural', firstPopularAnime.episodes ?? 0) }} </n-text>

                  <CustomDivider vertical />

                  <ScoreTag :score="firstPopularAnime.averageScore" />
                </n-flex>
              </n-flex>
            </router-link>

            <div class="popular-item__wrapper">
              <div v-for="item in restPopularAnime" :key="item.id" class="popular-item">
                <n-flex vertical>
                  <router-link :to="{ name: RouterEnum.Anime, params: { id: item.id } }">
                    <TitleImage :src="item.coverImage?.extraLarge ? item.coverImage?.extraLarge : undefined" :title="item"
                      :alt="getMediaTitle(item)" :lazy="false" />

                    <n-text class="popular-item__title"> {{ getMediaTitle(item) }}</n-text>
                  </router-link>
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
import { getMediaTitle, proxyImageUrl } from "@/utils/media";
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
import TitleImage from "@/components/TitleImage.vue";
import { useMediaQuery } from "@/composables/useMediaQuery";
import { EventBusyRound } from "@vicons/material"
import CustomDivider from "@/components/CustomDivider.vue";

const now = useNow()
const { t } = useI18n()
const isBannerVisible = useMediaQuery("(min-width: 700px)")

const scheduleStore = useScheduleStore()
const { selectedWeek, airingSchedules } = storeToRefs(scheduleStore)

const currentWeekData = computed(() => airingSchedules.value.get(selectedWeek.value))
const currentDayScheduleData = computed(() => (currentWeekData.value?.data ?? []).filter((item) => (dayjs.unix(item.airingAt)).isSame(dayjs(now.value), "day")))
const closestTitle = computed(() => (currentWeekData.value?.data ?? []).find((title) => dayjs.unix(title.airingAt).isAfter(dayjs(now.value))))
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

const store = useAnimeListStore();
const { loading, error, topAnimeList } = storeToRefs(store);

const popularAnimeListWithBanners = computed(() => {
  return topAnimeList.value.filter((item) => item.bannerImage)
})

const firstPopularAnime = computed(() => popularAnimeListWithBanners.value.at(0))
const restPopularAnime = computed(() => popularAnimeListWithBanners.value.slice(isBannerVisible.value ? 1 : 0, 10))

onMounted(() => {
  if (isEmpty(topAnimeList.value) || error.value) {
    store.fetchTopAnime();
  }

});
</script>

<style lang="scss" scoped>
.home {
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
