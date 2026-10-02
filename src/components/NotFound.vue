<template>
    <n-flex class="not-found" align="center" vertical :size="20">
        <n-icon v-if="icon" class="icon" :component="icon" />
        <slot v-else-if="slots.icon" name="icon"></slot>
        <logoHieroglyphSvg v-else class="logo-hieroglyph" aria-hidden="true" />

        <n-text v-if="title" class="title" strong depth="1">{{ title }}</n-text>
        <n-text v-if="info" class="info">{{ info }}</n-text>

        <slot name="actions"></slot>
    </n-flex>
</template>

<script lang="ts" setup>
import { useSlots, type Component } from 'vue';
import logoHieroglyphSvg from '@/assets/logoHieroglyph.svg'

export interface IProps {
    title?: string;
    info?: string;
    icon?: Component;
}

const props = defineProps<IProps>()
const slots = useSlots()
</script>

<style lang="scss" scoped>
.not-found {
    margin: 58px auto;
    height: 100%;
    max-width: 600px;

    .icon {
        font-size: 70px;
        color: color-mix(in srgb, var(--text-muted) 25%, var(--bg));
    }

    .logo-hieroglyph {
        width: 70px;
        height: 70px;
        color: color-mix(in srgb, var(--text-muted) 25%, var(--bg));
    }

    &>.n-text {
        font-size: 16px;
        text-align: center;
    }

    .title {
        font-size: 24px;
    }
}
</style>
