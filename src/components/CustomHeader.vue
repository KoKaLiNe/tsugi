<template>
    <div class="header" :class="{ '--wide': isWideLayout }">
        <router-link to="/">
            <Logo />
        </router-link>

        <div class="header__navigation">
            <n-menu class="header__menu" :value="tab" :options="menuOptions" mode="horizontal"
                @update:value="handleUpdateValue" />

            <SearchAutocomplete />

            <n-button quaternary circle :aria-label="themeBittonAriaLabel" @click="themeStore.toggleTheme">
                <template #icon>
                    <n-icon :component="isDarkTheme ? LightModeRound : DarkModeRound" />
                </template>
            </n-button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { MenuOption } from "naive-ui";
import { useI18n } from "vue-i18n";
import { LightModeRound, DarkModeRound } from "@vicons/material";
import { computed, onMounted, ref, watch } from "vue";
import { RouterEnum } from "@/router";
import { useRoute, useRouter } from "vue-router";
import Logo from "@/components/Logo.vue"
import { useThemeStore } from "@/stores/theme";
import { storeToRefs } from "pinia";
import { useIsWideLayout } from "@/composables/useIsWideLayout";
import SearchAutocomplete from "./Search/SearchAutocomplete.vue";

const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const isWideLayout = useIsWideLayout()
const themeStore = useThemeStore()
const { isDarkTheme } = storeToRefs(themeStore)
const themeBittonAriaLabel = computed(() => isDarkTheme.value ? t(`common.theme.light`) : t(`common.theme.dark`))

const tab = ref(RouterEnum.Home);

const menuOptions = computed<MenuOption[]>(() => (
    [
        {
            label: t("common.routes.home"),
            key: RouterEnum.Home,
        },
        {
            label: t("common.routes.schedule"),
            key: RouterEnum.Schedule,
        },
    ]
))

const handleUpdateValue = (key: RouterEnum, _item: MenuOption) => {
    tab.value = key;

    router.push({ name: key });
};

onMounted(() => {
    tab.value = route.name as RouterEnum;
});

watch(() => route.name, () => {
    tab.value = route.name as RouterEnum;
})
</script>

<style lang="scss" scoped>
.header {
    display: flex;
    justify-content: space-between;
    height: $header-height;
    padding: $narrow-layout-padding;

    position: sticky;
    top: 0;
    z-index: 10;
    background-color: var(--surface);

    &.--wide {
        padding: $wide-layout-padding;
    }

    &__navigation {
        display: flex;
        align-items: center;
        gap: $base-gap;
        width: 100%;

        .search-bar__wrapper {
            display: contents;
        }
    }

    .logo {
        &__wrapper {
            display: flex;
            align-items: center;
            gap: $base-gap;
            margin-right: 50px;
        }

        &-img {
            width: 30px;
            height: 30px;
        }
    }

    background-color: var(--surface);
    border-bottom: $base-border;
}

.logo {
    width: 100px;
    height: 100%;
}
</style>
