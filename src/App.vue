<template>
    <n-config-provider :theme="isDarkTheme ? darkTheme : lightTheme"
        :theme-overrides="isDarkTheme ? DARK_THEME : LIGHT_THEME">
        <n-message-provider>
            <CustomHeader></CustomHeader>
            <main class="app-content" :class="{ '--wide': isWideLayout }">
                <RouterView />
            </main>
        </n-message-provider>
    </n-config-provider>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import { lightTheme, darkTheme } from "naive-ui"
import CustomHeader from '@/components/CustomHeader.vue'
import { DARK_THEME, LIGHT_THEME } from './constants/themeVariables';
import { useThemeStore } from './stores/theme';
import { storeToRefs } from 'pinia';
import { useIsWideLayout } from './composables/useIsWideLayout';

const themeStore = useThemeStore()
const isWideLayout = useIsWideLayout()
const { isDarkTheme } = storeToRefs(themeStore)

</script>

<style lang="scss" scoped>
.app-content {
    min-height: calc(100vh - $header-height);
    padding: $narrow-layout-padding;
    background-color: var(--bg);

    &.--wide {
        padding: $wide-layout-padding;
    }
}
</style>
