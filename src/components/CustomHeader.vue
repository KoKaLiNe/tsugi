<template>
    <div class="header">
        <Logo />

        <div class="header__navigation">
            <n-menu class="header__menu" :value="tab" :options="menuOptions" mode="horizontal"
                @update:value="handleUpdateValue" />

            <div class="search-bar__wrapper">
                <n-auto-complete class="search-bar" :placeholder="t('common.search')">
                    <template #prefix>
                        <n-icon :component="SearchFilled" />
                    </template>

                </n-auto-complete>
            </div>

            <n-button quaternary circle v-if="isDarkTheme">
                <template #icon>
                    <n-icon>
                        <LightModeOutlined />
                    </n-icon>
                </template>
            </n-button>
            <n-button v-else quaternary circle>
                <template #icon>
                    <n-icon>
                        <NightlightSharp />
                    </n-icon>
                </template>
            </n-button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { MenuOption } from "naive-ui";
import { useI18n } from "vue-i18n";
import { SearchFilled, LightModeOutlined, NightlightSharp } from "@vicons/material";
import { computed, onMounted, ref, watch } from "vue";
import { RouterEnum } from "@/router";
import { useRoute, useRouter } from "vue-router";
import Logo from "@/components/Logo.vue"

const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const tab = ref(RouterEnum.Home);

const theme = computed(() => localStorage.getItem('theme') ?? 'dark')
const isDarkTheme = computed(() => theme.value === 'dark')

const menuOptions: MenuOption[] = [
    {
        label: t("common.routes.home"),
        key: RouterEnum.Home,
    },
];

const handleUpdateValue = (key: RouterEnum, _item: MenuOption) => {
    tab.value = key;

    router.push(key);
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
    height: 60px;
    padding: $base-padding;

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

    background-color: $main-color;
}

.logo {
    width: 100px;
    height: 100%;
}

.search-bar {
    max-width: 300px;
}
</style>
