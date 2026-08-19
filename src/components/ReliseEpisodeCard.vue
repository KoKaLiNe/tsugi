<template>
    <router-link class="episode" :to="{ name: RouterEnum.Anime, params: { id: episode.media?.id } }">
        <div class="episode-img__wrapper" :style="episodeStyle">
            <img class="episode-img"
                :src="episode.media?.coverImage?.extraLarge ? episode.media.coverImage?.extraLarge : undefined"
                :alt="episodeTitle" loading="lazy">
        </div>
        <n-flex vertical :size="0">
            <n-text strong>{{ episodeTitle }}</n-text>
            <n-text>{{ t("common.episodeShort") }} {{ episode.episode }}</n-text>
            <n-text>{{ dayjs.unix(episode.airingAt).format("HH:mm") }}</n-text>
        </n-flex>
    </router-link>

</template>

<script lang="ts" setup>
import type { AiringSchedulesFragment } from '@/api/generated/graphql';
import { RouterEnum } from '@/router';
import { getMediaTitle } from '@/utils/media';
import dayjs from 'dayjs';
import { computed, type StyleValue } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n()

interface IProps {
    episode: AiringSchedulesFragment
}
const props = defineProps<IProps>()

const episodeTitle = computed(() => getMediaTitle(props.episode.media))
const episodeStyle = computed(() => (<StyleValue>{
    backgroundColor: props.episode.media?.coverImage?.color ?? undefined
}))
</script>

<style lang="scss" scoped>
.episode {
    padding: $base-padding;

    background-color: var(--surface);
    border: $base-border;
    border-radius: $base-border-radius;

    cursor: pointer;

    &:hover {
        box-shadow: 0 2px 12px 0px color-mix(in srgb, var(--accent-hover) 40%, transparent)
    }

    &-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        

        &__wrapper {
            aspect-ratio: 2 / 3;
            overflow: hidden;
            border-radius: $base-border-radius;
            margin-bottom: $base-gap;
        }
    }
}
</style>