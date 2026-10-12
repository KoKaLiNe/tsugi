<template>
    <div class="carousel">
        <n-flex class="carousel__items-wrapper" :size="0" :wrap="false" ref="carouselWrapperRef">
            <div class="carousel__start" ref="carouselStartRef"></div>

            <n-flex :size="gap" :wrap="false">
                <div v-if="loading" v-for="index in 6" :key="index">
                    <slot name="loadingItem"></slot>
                </div>
                <div v-else v-for="(item, index) in items" :key="item.id" :ref="(el) => setSlotItemsRefs(el, index)">
                    <slot name="contentItem" :item="item"></slot>
                </div>
            </n-flex>

            <div class="carousel__end" ref="carouselEndRef"></div>
        </n-flex>

        <n-button class="controle-btn prev" circle secondary :disabled="isStartVisible"
            :aria-label="t('common.scrollBackward')" @click="scrollTo('backward')">
            <n-icon :component="ArrowBackIosNewRound" />
        </n-button>

        <n-button class="controle-btn next" circle secondary :disabled="isEndVisible"
            :aria-label="t('common.scrollForward')" @click="scrollTo('forward')">
            <n-icon :component="ArrowForwardIosRound" />
        </n-button>
    </div>
</template>

<script lang="ts" setup generic="T extends { id: number }">
import { onMounted, onUnmounted, ref, watch, type ComponentPublicInstance } from 'vue';
import { ArrowBackIosNewRound, ArrowForwardIosRound } from "@vicons/material"
import { useI18n } from 'vue-i18n';
import { isNil } from 'lodash-es';

const { t } = useI18n()

interface IProps {
    loading?: boolean;
    items: T[];
    gap?: number;
    scrollToIndex?: number;
}

const props = withDefaults(defineProps<IProps>(), {
    gap: 8
})

const carouselWrapperRef = ref()

const isStartVisible = ref(false)
const carouselStartRef = ref()

const isEndVisible = ref(false)
const carouselEndRef = ref()

let observerStart: IntersectionObserver | null = null;
let observerEnd: IntersectionObserver | null = null;

let slotItemsRef = <Element[]>[]
function setSlotItemsRefs(el: Element | ComponentPublicInstance | null, index: number) {
    if (el instanceof Element) {
        slotItemsRef[index] = el
    } else {
        slotItemsRef = []
    }
}

function scrollToItem(index = props.scrollToIndex) {
    if (!isNil(index)) {
        slotItemsRef[index]?.scrollIntoView?.({ behavior: 'instant', block: 'nearest', inline: 'center' })
    }
}

function scrollTo(direction: 'forward' | 'backward') {
    const slotItemRef = slotItemsRef.at(0)

    if (slotItemRef) {
        const slotItemWidth = slotItemRef.clientWidth
        const wrapperWidth = carouselWrapperRef.value.$el.clientWidth
        const scrollSize = wrapperWidth - slotItemWidth

        carouselWrapperRef.value.$el.scrollBy({
            top: 0,
            left: direction === 'backward' ? -scrollSize : scrollSize,
        })
    }
}

watch(() => props.scrollToIndex, (value) => {
    scrollToItem(value)
}, {
    flush: 'post',
})


onMounted(() => {
    observerStart = new IntersectionObserver(([entry]) => {
        isStartVisible.value = entry.isIntersecting;
    }, { root: carouselWrapperRef.value.$el, threshold: 0.1 });

    if (carouselStartRef.value) {
        observerStart.observe(carouselStartRef.value);
    }

    observerEnd = new IntersectionObserver(([entry]) => {
        isEndVisible.value = entry.isIntersecting;
    }, { root: carouselWrapperRef.value.$el, threshold: 0.1 });


    if (carouselEndRef.value) {
        observerEnd.observe(carouselEndRef.value);
    }

    if (!isNil(props.scrollToIndex)) {
        scrollToItem(props.scrollToIndex)
    }

})

onUnmounted(() => {
    if (observerStart) {
        observerStart.disconnect();
    }
    if (observerEnd) {
        observerEnd.disconnect();
    }
});
</script>

<style lang="scss" scoped>
.carousel {
    position: relative;

    .controle-btn {
        display: none;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);

        &.prev {
            left: -10px;
        }

        &.next {
            right: -10px;
        }
    }

    &__items {
        &-wrapper {
            overflow-x: auto;
            scrollbar-width: none;
            scroll-behavior: smooth;

            &::-webkit-scrollbar {
                display: none
            }

            overscroll-behavior-x: contain;

            @media (prefers-reduced-motion: reduce) {
                scroll-behavior: auto;
            }
        }
    }

    &:hover {
        @media (hover: hover) and (pointer: fine) {
            .controle-btn {
                display: inline-flex;
            }
        }
    }

}
</style>
