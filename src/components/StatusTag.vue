<template>
    <div v-if="status" class="status-tag" :data-status="status">
        {{ t(`TitleStatusEnum.${props.status}`) }}
    </div>
</template>

<script lang="ts" setup>
import type { MediaStatus } from '@/api/generated/graphql';
import { useI18n } from 'vue-i18n';

const { t } = useI18n()

interface IProps {
    status?: MediaStatus | null;
}

const props = defineProps<IProps>()
</script>

<style lang="scss" scoped>
.status-tag {
    line-height: 1;
    display: inline-flex;
    padding: 5px 8px;
    border-radius: $base-border-radius;

    @include status-colors-all;
}
</style>
