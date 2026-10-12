<template>
    <router-link class="cover-card" :to="{ name: RouterEnum.Anime, params: { id: item.id } }">
        <div class="cover-card__wrapper">
            <TitleImage class="cover-card__img"
                :src="item.coverImage?.extraLarge ? item.coverImage?.extraLarge : undefined"
                :coverImageColor="item.coverImage?.color" :alt="getMediaTitle(item)" :lazy="lazyLoadImg" />

            <div v-if="$slots.topLeft" class="cover-card__slot --top --left">
                <slot name="topLeft"> </slot>
            </div>
            <div v-if="$slots.topRight" class="cover-card__slot --top --right">
                <slot name="topRight"> </slot>
            </div>
            <div v-if="$slots.bottomRight" class="cover-card__slot --bottom --right">
                <slot name="bottomRight"> </slot>
            </div>
            <div v-if="$slots.bottomLeft" class="cover-card__slot --bottom --left">
                <slot name="bottomLeft"> </slot>
            </div>
        </div>

        <n-text class="cover-card__title" strong :title="getMediaTitle(item)"> {{ getMediaTitle(item) }}</n-text>
    </router-link>
</template>

<script lang="ts" setup>
import type { MediaWithTitle } from "@/types/MediaWithTitle";
import { RouterEnum } from '@/router';
import { getMediaTitle } from '@/utils/media';
import TitleImage from "@/components/TitleImage.vue";

interface IProps {
    lazyLoadImg?: boolean;
    item: MediaWithTitle & {
        id: number
        coverImage?: {
            color?: string | null;
            extraLarge?: string | null
        } | null
    }
}

withDefaults(defineProps<IProps>(), {
    lazyLoadImg: true
})
</script>

<style lang="scss" scoped>
.cover-card {
    display: block;

    // на этот класс ссылается CarouselEpisodeCard через :deep()
    &__wrapper {
        position: relative;
        border-radius: $base-border-radius;

        &:hover {
            box-shadow: $card-shadow-hover;
        }
    }

    &__img {
        margin-bottom: 0;
    }

    &__title {
        margin-top: $base-gap;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        font-weight: 600;
    }

    &__slot {
        position: absolute;

        &.--top {
            top: $base-gap;
        }

        &.--bottom {
            bottom: $base-gap;
        }

        &.--left {
            left: $base-gap;
        }

        &.--right {
            right: $base-gap;
        }
    }
}
</style>