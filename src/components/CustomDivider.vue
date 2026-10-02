<template>
    <n-divider :class="{ 'no-margin': noMargin }" :vertical="vertical"> </n-divider>
</template>

<script lang="ts" setup>
import type { DividerProps } from "naive-ui";

interface IProps {
    noMargin?: boolean;
    vertical?: DividerProps["vertical"];
}

const props = withDefaults(defineProps<IProps>(), {
    noMargin: false
})
</script>

<style lang="scss" scoped>
.no-margin {
    margin: 0;
}
</style>