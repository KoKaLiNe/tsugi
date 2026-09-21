<template>
    <n-flex class="page-block" :size="16" vertical>
        <n-flex justify="space-between">
            <n-flex :size="16" align="flex-end">
                <n-text class="page-block__title">{{ title }}</n-text>

                <slot name="subTitle" />
            </n-flex>

            <router-link v-if="link" :to="link">
                <n-text tag="div">
                    <n-flex align="center">
                        {{ linkText }}
                        <n-icon :component="ArrowRightAltRound" size="26" />
                    </n-flex>
                </n-text>
            </router-link>
        </n-flex>

        <slot name="content" />
    </n-flex>
</template>

<script lang="ts" setup>
import { ArrowRightAltRound } from "@vicons/material"
import type { RouteLocationAsPathGeneric, RouteLocationAsRelativeGeneric } from "vue-router";

interface IProps {
    title?: string;
    link?: string | RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric;
    linkText?: string
}

const props = defineProps<IProps>()
</script>

<style lang="scss" scoped>
.page-block {
    &__title {
        font-size: 24px;
        font-weight: 600;
    }
}
</style>
