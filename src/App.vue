<template>
    <n-config-provider :theme="isDarkTheme ? darkTheme : lightTheme">
        <CustomHeader></CustomHeader>
        <RouterView />
    </n-config-provider>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import { lightTheme, darkTheme } from "naive-ui"
import { computed, onMounted, ref } from 'vue';
import CustomHeader from '@/components/CustomHeader.vue'

const theme = ref(localStorage.getItem('theme') ?? 'light')
const isDarkTheme = computed(() => theme.value === 'dark')

onMounted(() => {
    const currentTheme = localStorage.getItem('theme')

    if (!currentTheme) {
        // localStorage.setItem('theme', 'dark')
    }
})
</script>
