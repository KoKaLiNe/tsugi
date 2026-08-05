<template>
    <n-config-provider :theme="isDarkTheme ? darkTheme : lightTheme"
        :theme-overrides="isDarkTheme ? DARK_THEME : LIGHT_THEME">
        <CustomHeader></CustomHeader>
        <n-layout content-style="padding: 12px;">
            <RouterView />
        </n-layout>
    </n-config-provider>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import { lightTheme, darkTheme } from "naive-ui"
import CustomHeader from '@/components/CustomHeader.vue'
import { DARK_THEME, LIGHT_THEME } from './constants/themeColors';
import { useThemeStore } from './stores/theme';
import { storeToRefs } from 'pinia';

const themeStore = useThemeStore()
const { isDarkTheme } = storeToRefs(themeStore)

</script>

<style lang="scss" scoped>
.n-layout {
    height: calc(100vh - 60px);
}
</style>
