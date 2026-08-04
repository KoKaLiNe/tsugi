<template>
    <div class="card">
        <div class="card__img-container">
            <img class="card__img" :src="card.coverImage?.large ?? undefined" :alt="getMediaTitle(card)" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { AnimeCardMediaFragment } from '@/api/generated/graphql';
import { getMediaTitle } from '@/utils/media';

interface IProps {
    card: AnimeCardMediaFragment
}
const props = defineProps<IProps>()
</script>

<style lang="scss" scoped>
.card {
    height: 320px;
}
</style>