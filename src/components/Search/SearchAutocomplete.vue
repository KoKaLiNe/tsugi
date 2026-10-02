<template>
    <div class="search-bar__wrapper" ref="searchBarWrapperRef" @focusout="handleFocusOut">
        <n-popover class="search-bar__select-wrapper" :show="showSearchDropdown && !isEmpty(searchOptions)"
            :show-arrow="false" width="trigger" :to="searchBarWrapperRef" scrollable
            content-class="search-bar__select-content" @clickoutside="handleClickOutside">

            <template #trigger>
                <n-input class="search-bar" v-model:value="searchQuery" :placeholder="t('common.search')"
                    :loading="loading" @focus="handleFocus" @keydown="handleKeydown" @input="handleSearchInput">

                    <template #prefix>
                        <n-icon :component="SearchRound" />
                    </template>
                </n-input>
            </template>

            <n-flex vertical :size="0">
                <div v-for="(option, index) in searchOptions" :key="option.id"
                    :ref="(el) => setSearchOptionRefs(el, index)">

                    <SearchOptionRow :option="option" @click="goToAnime(option.id)"
                        :isPending="highlightIndex === index" @mouseenter="setHighlightIndex(index)"
                        @mouseleave="clearHighlightIndex(index)" />
                </div>
            </n-flex>
        </n-popover>
    </div>
</template>

<script lang="ts" setup>
import type { GetSearchListQuery, GetSearchListQueryVariables, SearchListMediaFragment } from '@/api/generated/graphql';
import { ref, type ComponentPublicInstance } from 'vue';
import { debounce, isEmpty, isNull, } from 'lodash-es';
import { useI18n } from 'vue-i18n';
import SearchOptionRow from './SearchOptionRow.vue';
import { useMessage } from 'naive-ui';
import { SearchRound, } from "@vicons/material";
import { graphqlRequest } from '@/api/request.ts';
import { search } from '@/api/gql/requests.ts';
import { AxiosError } from 'axios';
import { useRouter } from 'vue-router';
import { RouterEnum } from '@/router/index.ts';
import { useAbortController } from '@/composables/useAbortController.ts';

const { t } = useI18n()
const router = useRouter()
const message = useMessage()

const emits = defineEmits<{
    (e: 'input', value: string): void
}>()

const searchBarWrapperRef = ref()

const loading = ref(false);
const searchError = ref(false)

const searchQuery = ref("");
const searchOptions = ref<SearchListMediaFragment[]>([]);

const showSearchDropdown = ref(false);
const closeSearchDropdown = () => {
    toggleSearchDropdown(false)
    highlightIndex.value = null
}
const toggleSearchDropdown = (value: boolean) => {
    showSearchDropdown.value = value;
};

const { isCurrentController, clearAbortController, getAbortController } = useAbortController()

async function handleSearchInput(value: string) {
    clearAbortController()

    highlightIndex.value = null
    searchError.value = false

    if (value?.trim().length >= 3) {
        await handleSearchInputDebounced(value.trim())
    } else {
        searchOptions.value = [];
        loading.value = false;
        toggleSearchDropdown(false)
    }
}

const handleSearchInputDebounced = debounce(async (value: string) => {
    const searchController = getAbortController();
    loading.value = true;

    try {
        const data = await graphqlRequest<GetSearchListQuery, GetSearchListQueryVariables>(search, { search: value }, { signal: searchController.signal })

        searchOptions.value = (data.Page?.media ?? []).filter((option) => !!option);
        toggleSearchDropdown(true);
    } catch (error) {
        if (error instanceof AxiosError && error.code === "ERR_CANCELED") {
            return
        }
        searchOptions.value = []
        searchError.value = true
        message.error(t("error.general"))
    } finally {
        if (isCurrentController(searchController)) {
            loading.value = false;
            clearAbortController()
        }
    }
}, 500);


function handleClickOutside(event: MouseEvent) {
    const isContain = searchBarWrapperRef.value?.contains(event.target);
    if (!isContain) {
        closeSearchDropdown();
    }
}

function handleFocus() {
    toggleSearchDropdown(true)

    if (searchError.value) {
        handleSearchInput(searchQuery.value)
    }
}

function handleFocusOut(event: FocusEvent) {
    const isFocusChanged = event.relatedTarget ? searchBarWrapperRef.value?.contains(event.relatedTarget) : true;
    if (!isFocusChanged) {
        closeSearchDropdown();
    }
}

let searchOptionsRef = <Element[]>[]
function setSearchOptionRefs(el: Element | ComponentPublicInstance | null, index: number) {
    if (el instanceof Element) {
        searchOptionsRef[index] = el
    } else {
        searchOptionsRef = []
    }
}
const highlightIndex = ref<number | null>(null)
function setHighlightIndex(value: number) {
    highlightIndex.value = value
}
function clearHighlightIndex(value: number) {
    if (value === highlightIndex.value) {
        highlightIndex.value = null
    }
}
function handleKeydown(event: KeyboardEvent) {
    const key = event.key

    switch (key) {
        case "Escape":
            closeSearchDropdown()
            break;

        case "Enter":
            if (!isNull(highlightIndex.value)) {
                goToAnime(searchOptions.value[highlightIndex.value].id)
            } else {
                goToSearch()
            }
            break;

        case "ArrowDown":
            event.preventDefault()

            if (isNull(highlightIndex.value)) {
                setHighlightIndex(0)
            } else if (highlightIndex.value === searchOptions.value.length - 1) {
                clearHighlightIndex(highlightIndex.value)
            } else {
                highlightIndex.value += 1
            }

            if (!isNull(highlightIndex.value)) {
                searchOptionsRef[highlightIndex.value]?.scrollIntoView?.({ block: 'nearest' })
            }
            break;

        case "ArrowUp":
            event.preventDefault()
            if (highlightIndex.value === 0) {
                clearHighlightIndex(highlightIndex.value)
            } else if (isNull(highlightIndex.value)) {
                setHighlightIndex(searchOptions.value.length - 1)
            } else {
                highlightIndex.value -= 1
            }

            if (!isNull(highlightIndex.value)) {
                searchOptionsRef[highlightIndex.value]?.scrollIntoView?.({ block: 'nearest' })
            }
            break;

        default:
            return;
    }
}

function goToSearch() {
    const query = <Record<string, string>>{}

    if (searchQuery.value.trim()) {
        query.q = searchQuery.value
    }

    router.push({ name: RouterEnum.Search, query })
    closeSearchDropdown();
}
function goToAnime(id: number) {
    closeSearchDropdown();
    router.push({ name: RouterEnum.Anime, params: { id } })
}
</script>

<style lang="scss" scoped>
.search-bar {
    max-width: 400px;

    &__wrapper {
        color: blue;

        :deep(.search-bar__select-wrapper) {
            max-height: 500px;

            .search-bar__select-content {
                padding: 5px;
            }
        }
    }
}
</style>
