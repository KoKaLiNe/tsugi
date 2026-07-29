<template>
    <n-config-provider :theme="isDarkTheme ? darkTheme : lightTheme">
        <RouterView />
    </n-config-provider>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import { lightTheme, darkTheme } from "naive-ui"
import { computed, onMounted, ref } from 'vue';

const theme = ref(localStorage.getItem('theme') ?? 'dark')
const isDarkTheme = computed(() => theme.value === 'dark')

onMounted(() => {
    const currentTheme = localStorage.getItem('theme')

    if (!currentTheme) {
        localStorage.setItem('theme', 'dark')
    }
})
</script>
