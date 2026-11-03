<template>
    <div class="adult-wrapper" :class="{ '--blurred': adultFilter }" ref="adult-wrapper" @click="onClick">
        <n-icon v-if="adultFilter" :component="VisibilityOffRound" class="icon" />

        <component v-if="adultFilter" :is="blurComponent" class="blur-filter" v-bind="blurComponentProps" />

        <slot></slot>
    </div>
</template>

<script lang="ts" setup>
import { VisibilityOffRound } from '@vicons/material'
import { useAdultRule } from '@/composables/useAdultRule';
import { computed, useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n()
const { isUserAdult, showConfirmModal, focusElement } = useAdultRule()

interface IProps {
    isAdult?: boolean | null;
    canChangeAdultRule?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
    isAdult: false,
    canChangeAdultRule: true,
})

const adultWrapperRef = useTemplateRef('adult-wrapper')

const adultFilter = computed(() => isUserAdult.value ? false : props.isAdult)

const blurComponent = computed(() => props.canChangeAdultRule ? 'button' : 'div')
const blurComponentProps = computed(() => props.canChangeAdultRule ? {
    type: 'button',
    'aria-label': t('common.adultModal.showCover')
} : {})

function onClick(e: MouseEvent) {
    if (props.canChangeAdultRule && props.isAdult && !isUserAdult.value) {
        e.preventDefault()

        const itemWrapper = adultWrapperRef.value?.closest('[data-wrapper]')

        if (itemWrapper) {
            const itemLink = itemWrapper.querySelector('a')
            focusElement.value = itemLink
        }

        showConfirmModal.value = true
    }
}
</script>

<style lang="scss" scoped>
.adult-wrapper {
    container-type: inline-size;
    position: relative;
    overflow: hidden;
    border-radius: inherit;

    &.--blurred {
        z-index: 3;
    }

    .blur-filter {
        cursor: pointer;
        position: absolute;
        top: -1px;
        left: -1px;
        width: calc(100% + 2px);
        height: calc(100% + 2px);
        backdrop-filter: blur(20px) brightness(0.55);

        &:focus-visible {
            outline-offset: -2px;
        }
    }

    .icon {
        cursor: pointer;
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 3;
        transform: translate(-50%, -50%);
        color: $white;
        font-size: min(33cqw, 46px);
    }
}
</style>