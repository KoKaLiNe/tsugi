<template>
    <CoverCard class="title-card" :item="item" :lazyLoadImg="lazyLoadImg">
        <template #topRight>
            <ScoreTag :score="item.averageScore" />
        </template>

        <template #bottomLeft>
            <n-flex class="title-card__info" align="center" :size="5">
                <n-text v-if="item.format" tag="div" strong>
                    {{ t(`TitleFormatEnum.${item.format}`) }}
                </n-text>
                <CustomDivider v-if="item.format && item.startDate?.year" type="dot" vertical no-margin />
                <n-text v-if="item.startDate?.year" tag="div" strong>
                    {{ item.startDate?.year }}
                </n-text>
            </n-flex>
        </template>
    </CoverCard>
</template>

<script lang="ts" setup>
import CoverCard from '@/components/CoverCard.vue';
import ScoreTag from '@/components/ScoreTag.vue';
import CustomDivider from '@/components/CustomDivider.vue';
import { useI18n } from 'vue-i18n';
import type { MediaWithTitle, } from "@/types/MediaWithTitle";
import type { MediaFormat } from '@/api/generated/graphql'

const { t } = useI18n()

interface IProps {
    lazyLoadImg?: boolean;
    item: MediaWithTitle & {
        id: number
        coverImage?: {
            color?: string | null;
            extraLarge?: string | null;
        } | null;
        averageScore: number | null,
        format: MediaFormat | null,
        startDate: {
            year: number | null
        } | null
    }
}
withDefaults(defineProps<IProps>(), {
    lazyLoadImg: true
})
</script>

<style lang="scss" scoped>
.title-card {
    &__info {
        padding: 2px 6px;
        border-radius: $base-border-radius;
        background-color: var(--surface);
    }
}
</style>