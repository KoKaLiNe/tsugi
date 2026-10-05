<template>
    <div v-if="!isNil(score)" class="score-tag" :class="tagColor">
        {{ averageScore }}
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { isNil } from 'lodash-es';

interface IProps {
    score: number | null;
    size?: 'small' | 'medium'
}

const props = withDefaults(defineProps<IProps>(), {
    size: "small"
})

const averageScore = computed(() => {
    if (!isNil(props.score)) {
        return (props.score / 10).toFixed(1)
    } else {
        return null
    }
});

const tagColor = computed(() => {
    let scoreClass: string | null = null
    let sizeClass = `--${props.size}`

    if (!isNil(props.score)) {
        if (props.score >= 65) {
            scoreClass = '--high'
        } else if (props.score >= 50) {
            scoreClass = '--mid'
        } else {
            scoreClass = '--low'
        }
    }

    return [scoreClass, sizeClass].filter(Boolean).join(" ")
})

</script>

<style lang="scss" scoped>
.score-tag {
    line-height: 1;
    display: inline-flex;
    width: fit-content;
    align-items: center;
    justify-content: center;
    border-radius: $base-border-radius;

    background-color: var(--score-low);
    color: var(--on-score-low);

    padding: 4px 5px;
    height: 22px;
    min-width: 30px;

    &.--medium {
        height: $tag-height;
        min-width: 30px;
    }

    &.--high {
        background-color: var(--score-high);
        color: var(--on-score-high);
    }

    &.--mid {
        background-color: var(--score-mid);
        color: var(--on-score-mid);
    }

    &.--low {
        background-color: var(--score-low);
        color: var(--on-score-low);
    }
}
</style>
