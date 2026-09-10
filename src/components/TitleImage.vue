<template>
    <div class="title__wrapper" :style="titleStyle" :class="sizeClass">
        <img class="title__img" :src="src" :alt="alt" :loading="lazy ? 'lazy' : undefined">
    </div>
</template>

<script lang="ts" setup>
import type { AiringSchedulesFragment, SearchListMediaFragment } from '@/api/generated/graphql';
import { computed, type StyleValue } from 'vue';

type TitleType = AiringSchedulesFragment['media'] | SearchListMediaFragment

interface IProps {
    alt: string;
    title: TitleType;
    src?: string;
    size?: 'small' | 'medium' | 'large';
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
    }
});

const titleStyle = computed(() => (<StyleValue>{
    backgroundColor: props.title?.coverImage?.color ?? undefined
}))
</script>

<style lang="scss" scoped>
.title {
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
    }

    &__img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}
</style>
