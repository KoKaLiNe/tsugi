<template>
    <div class="card">
        <div class="card__img-container">
            <img class="card__img" :src="card.coverImage.large" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { IMedia } from '@/types/GraphQL';

interface IProps {
    card: IMedia
}
const props = defineProps<IProps>()
</script>

<style lang="scss" scoped>
.card {
    height: 320px;
}
</style>