<template>
    <n-config-provider :theme="isDarkTheme ? darkTheme : lightTheme"
        :theme-overrides="isDarkTheme ? DARK_THEME : LIGHT_THEME">
        <CustomHeader></CustomHeader>
        <n-message-provider>
            <main class="app-content">
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

const themeStore = useThemeStore()
const { isDarkTheme } = storeToRefs(themeStore)

</script>

<style lang="scss" scoped>
.app-content {
    min-height: calc(100vh - var(--header-height));
    padding: $layout-padding;
    background-color: var(--bg);
}
</style>
