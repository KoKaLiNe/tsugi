<template>
    <div class="logo__wrapper">
        <img :src="logoSvg" alt="Tsugi" class="logo-img" />
        <span>
            次
        </span>
    </div>
</template>

<script lang="ts" setup>
import logoSvg from '@/assets/logo.svg'
</script>

<style lang="scss" scoped>
.logo-img {
    height: 35px;
}
</style>