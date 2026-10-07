<template>
    <n-result class="result" :size="size">
        <template #icon>
            <n-icon v-if="icon" class="icon" :component="icon" />
            <slot v-else-if="slots.icon" name="icon"></slot>
            <logoHieroglyphSvg v-else class="logo-hieroglyph" aria-hidden="true" />
        </template>

        <slot name="footer"></slot>
    </n-result>
</template>

<script lang="ts" setup>
import { useSlots, type Component } from 'vue';
import type { ResultProps, ResultSize } from "naive-ui"
import logoHieroglyphSvg from '@/assets/logoHieroglyph.svg'

export interface IProps extends  /* @vue-ignore */ ResultProps {
    size?: ResultSize;
    icon?: Component;
}
withDefaults(defineProps<IProps>(), {
    size: 'small'
})

const slots = useSlots()
</script>

<style lang="scss" scoped>
.result {
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
}
</style>
