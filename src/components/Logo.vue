<template>
    <div class="logo__wrapper">
        <img :src="logoSvg" alt="Tsugi" class="logo-img" />
        <n-text> 次 </n-text>
    </div>
</template>

<script lang="ts" setup>
import logoSvg from '@/assets/logo.svg'
</script>

<style lang="scss" scoped>
.logo {
    &__wrapper {
        margin-top: 4px;
    }

    &-img {
        height: 35px;
    }
}
</style>