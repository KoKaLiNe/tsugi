<template>
    <n-result class="result" :size="size">
        <template #icon>
            <n-icon v-if="icon" class="icon" :component="icon" :size="iconSizePx" />
            <slot v-else-if="$slots.icon" name="icon"></slot>
            <logoHieroglyphSvg v-else class="logo-hieroglyph"
                :style="{ width: iconSizePx, height: iconSizePx }" aria-hidden="true" />
        </template>

        <n-flex justify="center">
            <slot name="footer"></slot>
        </n-flex>
    </n-result>
</template>

<script lang="ts" setup>
import { computed, type Component } from 'vue';
import type { ResultProps, ResultSize } from "naive-ui"
import logoHieroglyphSvg from '@/assets/logoHieroglyph.svg'

export interface IProps extends  /* @vue-ignore */ ResultProps {
    size?: ResultSize;
    icon?: Component;
    iconSize?: number
}
const props = withDefaults(defineProps<IProps>(), {
    size: 'medium',
    iconSize: 70
})

const iconSizePx = computed(() => `${props.iconSize}px`)
</script>

<style lang="scss" scoped>
.result {
    margin: 58px auto;
    height: 100%;
    max-width: 600px;

    .icon {
        color: color-mix(in srgb, var(--text-muted) 25%, var(--bg));
    }

    .logo-hieroglyph {
        color: color-mix(in srgb, var(--text-muted) 25%, var(--bg));
    }
}
</style>
