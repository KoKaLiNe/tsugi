<template>
    <NotFound :title="t('views.notFound.title')" :info="t('views.notFound.info')">
        <template #actions>
            <n-flex>
                <n-button type="primary" @click="goTo(RouterEnum.Home)">{{ t('common.goTo.home') }}</n-button>
                <n-button @click="goTo(RouterEnum.Schedule)">{{ t('common.routes.schedule') }}</n-button>
            </n-flex>
        </template>
    </NotFound>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import NotFound from '@/components/NotFound.vue';
import { RouterEnum } from '@/router';
import { useRouter } from 'vue-router';

const { t } = useI18n()
const router = useRouter()

function goTo(name: RouterEnum) {
    router.replace({ name })
}
</script>
