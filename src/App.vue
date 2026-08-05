<template>
    <n-config-provider :theme="isDarkTheme ? darkTheme : lightTheme"
        :theme-overrides="isDarkTheme ? DARK_THEME : LIGHT_THEME">
        <CustomHeader></CustomHeader>
        <RouterView />
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
