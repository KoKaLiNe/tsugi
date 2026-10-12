<template>
    <n-flex class="option__wrapper" :class="{ pending: isPending }" :wrap="false" @click="emits('click')"
        @mouseenter="emits('mouseenter')" @mouseleave="emits('mouseleave')">
        <TitleImage class="option__img" :src="option?.coverImage?.medium ? option.coverImage?.medium : undefined"
            :coverImageColor="option.coverImage?.color" :alt="optionTitle" size="medium" :lazy="false" />

        <n-flex class="option-info__wrapper" vertical :size="8" justify="space-between">
            <n-flex vertical>
                <n-text strong class="option__title"> {{ optionTitle }} </n-text>

                <ScoreTag :score="option.averageScore" />
            </n-flex>

            <n-text> {{ titleInfo }} </n-text>
        </n-flex>
    </n-flex>
</template>

<script lang="ts" setup>
import type { SearchListMediaFragment } from '@/api/generated/graphql';
import { getMediaTitle } from '@/utils/media';
import TitleImage from '@/components/TitleImage.vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import ScoreTag from '@/components/ScoreTag.vue';

const { t } = useI18n()

interface IEmits {
    (e: 'click'): void
    (e: 'mouseenter'): void
    (e: 'mouseleave'): void
}
const emits = defineEmits<IEmits>()

interface IProps {
    option: SearchListMediaFragment;
    isPending: boolean;
}
const props = defineProps<IProps>()

const optionTitle = computed(() => getMediaTitle(props.option))
const titleInfo = computed(() => {
    const titleFormat = props.option.format ? t(`TitleFormatEnum.${props.option.format}`) : null;
    return [titleFormat, props.option.startDate?.year].filter(Boolean).join(" / ")
})
</script>

<style lang="scss" scoped>
.option {
    &__wrapper {
        padding: $base-gap;
        border-radius: $base-border-radius;
        cursor: pointer;

        &.pending {
            background-color: var(--bg);
        }
    }

    &__img {
        flex-shrink: 0;
    }

    &-info {
        &__wrapper {
            padding: 2px 0px 8px 0px;
        }
    }

    &__title {
        text-wrap: auto;
        font-size: 16px;
    }
}
</style>
