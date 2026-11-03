<template>
    <AdultImageWrapper class="title-img__wrapper" :style="titleStyle" :class="sizeClass" :is-adult="isAdult"
        :can-change-adult-rule="canChangeAdultRule">
        <img class="title-img" :src="src" :alt="alt" :loading="lazy ? 'lazy' : undefined">
    </AdultImageWrapper>
</template>

<script lang="ts" setup>
import { computed, type StyleValue } from 'vue';
import AdultImageWrapper from './AdultImageWrapper.vue';

interface IProps {
    alt: string;
    isAdult?: boolean | null;
    coverImageColor?: string | null;
    src?: string;
    size?: 'small' | 'medium' | 'large' | 'extra-large';
    lazy?: boolean;
    canChangeAdultRule?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
    lazy: true,
    canChangeAdultRule: true,
    isAdult: false,
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
    backgroundColor: props.coverImageColor ?? undefined
}))

</script>

<style lang="scss" scoped>
.title-img {
    &__wrapper {
        position: relative;

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
