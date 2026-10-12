<template>
    <div v-if="type === 'dot'" class="divider --dot" :class="{ 'no-margin': noMargin }"></div>
    <n-divider v-else class="divider --line" :class="{ 'no-margin': noMargin }" :vertical="vertical"> </n-divider>
</template>

<script lang="ts" setup>
import type { DividerProps } from "naive-ui";

interface IProps {
    type?: 'dot' | 'line';
    noMargin?: boolean;
    vertical?: DividerProps["vertical"];
}

const props = withDefaults(defineProps<IProps>(), {
    type: 'line',
    noMargin: false
})
</script>

<style lang="scss" scoped>
.divider {

    &.--dot {
        display: inline-block;
        margin: 0 8px;
        height: 2px;
        width: 2px;
        background-color: var(--text-strong);
        border-radius: 50%;
    }

    &.no-margin {
        margin: 0;
    }
}
</style>