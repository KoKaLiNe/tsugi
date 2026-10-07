<template>
    <n-flex vertical>
        <div>
            loading: {{ loading }}
        </div>
        <div>
            page: {{ page }}
        </div>

        <div>
            <n-input clearable :value="searchValue" @input="onInput" @keydown.enter="onKeyDownEnter"
                @clear="onClearValue">
                <template #prefix>
                    <n-icon :component="SearchRound" />
                </template>
            </n-input>
        </div>
        <n-flex v-if="!isEmpty(list)">
            <div v-for="item in list" :key="item.id">
                {{ getMediaTitle(item) }}
            </div>
        </n-flex>

        <n-spin v-if="loading || loadingMore" size="small" />

        <div>
            <n-button v-if="hasNextPage" :disabled="loadingMore" @click="showMore"> Показать ещё </n-button>
        </div>
    </n-flex>
</template>

<script lang="ts" setup>
import { useSearchListStore } from '@/stores/searchList';
import { getMediaTitle } from '@/utils/media';
import { isEmpty } from 'lodash-es';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
import { useRoute, useRouter, type LocationQuery } from 'vue-router';
import { SearchRound } from "@vicons/material";
import { RouterEnum } from '@/router';

const route = useRoute()
const router = useRouter()
const searchListStore = useSearchListStore()
const { loading, loadingMore, error, filter, list, page, hasNextPage } = storeToRefs(searchListStore)

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

<style lang="scss" scoped></style>
