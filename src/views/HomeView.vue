<template>
  <n-layout class="layout">
    <n-flex class="home" vertical>
      <n-skeleton v-if="loading" height="350px" width="100%"></n-skeleton>
      <n-carousel v-else class="carousel" centered-slides autoplay>
        <div v-for="slide in bannerList" :key="slide.id" class="carousel__slide"
          :style="{ backgroundImage: `url(${slide.bannerImage})` }" />
      </n-carousel>

      <n-h3>Популярные</n-h3>

      <n-skeleton v-if="loading" height="350px" width="100%"></n-skeleton>
      <div v-else class="slider__wrapper">
        <n-carousel class="slider" slides-per-view="auto" :space-between="12" :loop="false" :show-dots="false"
          ref="sliderRef">
          <n-carousel-item v-for="slide in topAnimeList" :key="slide.id" style="width: 250px">
            <div class="slider__item">
              {{ slide.averageScore ? slide.averageScore / 10 : '—' }}
              <div class="slider__item-img" :style="slideStyle(slide)"> </div>
              <router-link to="/#">
                {{ getMediaTitle(slide) }}
              </router-link>
            </div>
          </n-carousel-item>
        </n-carousel>

        <n-button class="slider__arrow --left" strong secondary circle @click="sliderRef?.prev">
          <n-icon>
            <ArrowBackIosFilled />
          </n-icon>
        </n-button>

        <n-button class="slider__arrow --right" strong secondary circle @click="sliderRef?.next">
          <n-icon>
            <ArrowForwardIosFilled />
          </n-icon>
        </n-button>
      </div>
    </n-flex>
  </n-layout>
</template>

<script lang="ts" setup>
import { useAnimeListStore } from "@/stores/animeList";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref, type StyleValue } from "vue";
import { ArrowBackIosFilled, ArrowForwardIosFilled } from "@vicons/material"
import type { CarouselInst } from "naive-ui";
import type { AnimeCardMediaFragment } from "@/api/generated/graphql";
import { getMediaTitle } from "@/utils/media";

const store = useAnimeListStore();
const { loading, topAnimeList } = storeToRefs(store);

const sliderRef = ref<CarouselInst>()

const bannerList = computed(() => topAnimeList.value.filter((item) => item.bannerImage))

const slideStyle = (slide: AnimeCardMediaFragment) => {
  return <StyleValue>{
    backgroundImage: slide.coverImage?.large ? `url(${slide.coverImage?.large})` : undefined,
    backgroundColor: slide.coverImage?.color ?? undefined
  }
}

onMounted(() => {
  store.fetchTopAnime();
});
</script>

<style lang="scss" scoped>
.layout {
  padding-left: 50px;
  padding-right: 50px;
}

.home {
  padding: $base-padding;
}

.carousel {
  height: 350px;

  &__slide {
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
}

.slider {
  &__wrapper {
    position: relative;
  }

  &__item {
    padding: $base-padding;

    &-img {
      height: 300px;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    }
  }

  &__arrow {
    background-color: white;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 100;

    &.--left {
      left: -10px
    }

    &.--right {
      right: -10px
    }
  }
}
</style>
