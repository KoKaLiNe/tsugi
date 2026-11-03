<template>
    <n-config-provider :theme="isDarkTheme ? darkTheme : lightTheme"
        :theme-overrides="isDarkTheme ? DARK_THEME : LIGHT_THEME">
        <n-message-provider placement="bottom-right">
            <CustomHeader></CustomHeader>
            <main class="app-content" :class="{ '--wide': isWideLayout }" ref="appContentRef">
                <RouterView />

                <n-modal v-model:show="showConfirmModal" :to="appContentRef" class="adult-check-modal">
                    <n-card style="width: 380px" :title="t('common.adultModal.title')" :bordered="false" role="dialog"
                        aria-modal="true">
                        {{ t('common.adultModal.content') }}
                        <template #footer>
                            <n-flex justify="flex-end">
                                <n-button @click="setUserAdultStatus(false)">
                                    {{ t('common.adultModal.actions.no') }}
                                </n-button>
                                <n-button @click="setUserAdultStatus(true)" type="primary">
                                    {{ t('common.adultModal.actions.yes') }}
                                </n-button>
                            </n-flex>
                        </template>
                    </n-card>
                </n-modal>
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
import { useAdultRule } from './composables/useAdultRule';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const themeStore = useThemeStore()
const isWideLayout = useIsWideLayout()
const { isDarkTheme } = storeToRefs(themeStore)
const { t } = useI18n()
const { setUserAdultRule, showConfirmModal } = useAdultRule()

const appContentRef = ref()

function setUserAdultStatus(result: boolean) {
    setUserAdultRule(result)
    showConfirmModal.value = false
}
</script>

<style lang="scss" scoped>
.app-content {
    min-height: calc(100vh - $header-height);
    padding: $narrow-layout-padding;
    background-color: var(--bg);

    &.--wide {
        padding: $wide-layout-padding;
    }

    .adult-check-modal {
        :deep(.n-card-header) {
            padding-bottom: 0;
        }
    }
}
</style>
