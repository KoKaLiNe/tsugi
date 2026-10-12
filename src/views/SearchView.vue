<template>
    <n-flex class="search-page" vertical :size="16">
        <n-text class="search-page__title">{{ t('views.search.title') }}</n-text>

        <div class="search-page__filter-wrapper">
            <n-input class="filter-text" :value="searchValue"
                :placeholder="t('views.search.actions.search.placeholder')" clearable @input="onInput"
                @keydown.enter="onKeyDownEnter" @clear="onClearValue">
                <template #prefix>
                    <n-icon :component="SearchRound" />
                </template>
            </n-input>
        </div>

        <div class="search-page__content">
            <template v-if="!isEmpty(list)">
                <div class="content-item" v-for="item in list" :key="item.id">
                    <TitleCard :item="item" lazyLoadImg/>
                </div>
            </template>

            <template v-if="loading">
                <div v-for="index in 12" :key="index">
                    <n-flex>
                        <n-skeleton height="100%" :style="{ aspectRatio: 2 / 3 }" :sharp="false" />
                        <n-skeleton text :sharp="false" />
                    </n-flex>
                </div>
            </template>
        </div>

        <template v-if="error">
            <CustomResult size="small" :icon="CloudOffRound" :title="t('views.search.actions.search.error.general')">
                <template #footer>
                    <n-button size="large" @click="searchListStore.fetchSearchList">
                        {{ t('common.retry') }}
                    </n-button>
                </template>
            </CustomResult>
        </template>

        <template v-else-if="!loading && isEmpty(list)">
            <CustomResult size="small" :icon="SentimentDissatisfiedRound"
                :title="t('views.search.actions.search.empty')">
                <template #footer>
                    <n-button size="large" @click="showFullCatalog"> {{ t('views.search.fullCatalog') }} </n-button>
                </template>
            </CustomResult>
        </template>

        <div v-if="hasNextPage" class="search-page__show-more">
            <n-button size="large" :loading="loadingMore" :disabled="loadingMore" @click="showMore">
                {{ t('views.search.actions.loadMore.button') }}
            </n-button>
        </div>
    </n-flex>
</template>

<script lang="ts" setup>
import { useSearchListStore } from '@/stores/searchList';
import { isEmpty } from 'lodash-es';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
import { useRoute, useRouter, type LocationQuery } from 'vue-router';
import { SearchRound, CloudOffRound, SentimentDissatisfiedRound } from "@vicons/material";
import { RouterEnum } from '@/router';
import CustomResult from '@/components/CustomResult.vue';
import { useI18n } from 'vue-i18n';
import { useMessage } from 'naive-ui';
import TitleCard from '@/components/TitleCard.vue';

const { t } = useI18n()
const message = useMessage()
const route = useRoute()
const router = useRouter()

const searchListStore = useSearchListStore()
const { loading, loadingMore, error, errorMore, filter, list, page, hasNextPage } = storeToRefs(searchListStore)

function getQuerySearchValue(value: LocationQuery) {
    return (Array.isArray(value.q) ? value.q[0] : value.q) ?? null
}

const searchValue = ref(getQuerySearchValue(route.query))

function onInput(value: string) {
    searchValue.value = value ? value : null
}

function onKeyDownEnter() {
    router.replace({ name: RouterEnum.Search, query: { q: searchValue.value?.trim() ? searchValue.value : null } })
}

function onClearValue() {
    searchValue.value = null
    onKeyDownEnter()
}

function showMore() {
    searchListStore.fetchSearchListMore()
}

function showFullCatalog() {
    onClearValue()
}

watch(() => errorMore.value, (value) => {
    if (value) {
        message.error(t("views.search.actions.loadMore.error"))
    }
})

watch(() => route.query, (value) => {
    const queryString = getQuerySearchValue(value)

    if (filter.value.search !== queryString || error.value) {
        searchValue.value = queryString
        page.value = 1
        filter.value.search = queryString
        searchListStore.fetchSearchList()
    }
}, { immediate: true })
</script>

<style lang="scss" scoped>
.search-page {
    max-width: 1240px;
    margin: 0 auto;

    &__title {
        font-size: 24px;
        font-weight: 600;
    }

    &__content {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(max(150px, calc((100% - 5 * 16px) / 6)), 1fr));
        gap: 16px;
    }

    .filter {
        &-text {
            max-width: 500px;
        }
    }

    &__show-more {
        align-self: center;
    }
}
</style>
