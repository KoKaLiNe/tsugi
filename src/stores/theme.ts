import { ThemeEnum } from "@/types/Theme";
import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";

export const useThemeStore = defineStore('theme', () => {
    const appTheme = ref(readInitial())
    const isDarkTheme = computed(() => appTheme.value === ThemeEnum.Dark)

    watch(appTheme, (value) => {
        document.documentElement.dataset.theme = value
    }, { immediate: true })

    function toggleTheme() {
        appTheme.value = isDarkTheme.value ? ThemeEnum.Light : ThemeEnum.Dark
        localStorage.setItem('theme', appTheme.value)
    }

    function readInitial() {
        const savedtheme = localStorage.getItem('theme')

        if (savedtheme === ThemeEnum.Light || savedtheme === ThemeEnum.Dark) {
            return savedtheme
        } else {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? ThemeEnum.Dark : ThemeEnum.Light
        }

    }

    return { appTheme, isDarkTheme, toggleTheme }
})