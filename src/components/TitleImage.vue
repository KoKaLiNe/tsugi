<template>
    <div class="title-img__wrapper" :style="titleStyle" :class="sizeClass">
        <img class="title-img" :src="proxyImageUrl(src)" :alt="alt" :loading="lazy ? 'lazy' : undefined">
    </div>
</template>

<script lang="ts" setup>
import type { AiringSchedulesFragment, AnimeByIdMediaFragment, AnimeCardMediaFragment } from '@/api/generated/graphql';
import { proxyImageUrl } from '@/utils/media';
import { computed, type StyleValue } from 'vue';

type TitleType = AiringSchedulesFragment['media'] | AnimeCardMediaFragment| AnimeByIdMediaFragment

interface IProps {
    alt: string;
    title: TitleType;
    src?: string;
    size?: 'small' | 'medium' | 'large' | 'extra-large';
    lazy?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
    lazy: true,
})

const sizeClass = computed(() => {
    return {
        '--small': props.size === 'small',
        '--medium': props.size === 'medium',
        '--large': props.size === 'large',
        '--extra-large': props.size === 'extra-large',
    }
});

const titleStyle = computed(() => (<StyleValue>{
    backgroundColor: props.title?.coverImage?.color ?? undefined
}))
</script>

<style lang="scss" scoped>
.title-img {
    &__wrapper {
        aspect-ratio: 2 / 3;
        overflow: hidden;
        border-radius: $base-border-radius;
        margin-bottom: $base-gap;

        &.--small {
            margin-bottom: 0;
            height: 80px;
        }

        &.--medium {
            margin-bottom: 0;
            height: 120px;
        }

        &.--large {
            margin-bottom: 0;
            height: 220px;
        }

        &.--extra-large {
            margin-bottom: 0;
            height: 320px;
        }
    }

    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>
