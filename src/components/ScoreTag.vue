<template>
    <div v-if="!isNil(score)" class="score-tag" :data-score="averageScore" :class="tagColor">
        {{ averageScore }}
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { isNil } from 'lodash-es';

interface IProps {
    score: number | null;
}

const props = defineProps<IProps>()

const averageScore = computed(() => {
    if (!isNil(props.score)) {
        return (props.score / 10).toFixed(1)
    } else {
        return null
    }
});

const tagColor = computed(() => {
    if (!isNil(props.score)) {
        if (props.score >= 65) {
            return 'score-tag--high'
        } else if (props.score >= 50) {
            return 'score-tag--mid'
        } else {
            return 'score-tag--low'
        }
    } else {
        return ''
    }
})

</script>

<style lang="scss" scoped>
.score-tag {
    line-height: 1;
    display: inline-flex;
    width: 30px;
    height: 20px;
    align-items: center;
    justify-content: center;
    border-radius: $base-border-radius;

    background-color: var(--score-low);
    color: var(--on-score-low);

    &--high {
        background-color: var(--score-high);
        color: var(--on-score-high);
    }

    &--mid {
        background-color: var(--score-mid);
        color: var(--on-score-mid);
    }

    &--low {
        background-color: var(--score-low);
        color: var(--on-score-low);
    }
}
</style>
