<template>
    <div class="logo__wrapper">
        <LogoSvg class="logo-img" role="img" aria-label="Tsugi" />
        <logoHieroglyphSvg class="logo-hieroglyph" aria-hidden="true" />
    </div>
</template>

<script lang="ts" setup>
import LogoSvg from '@/assets/logo.svg'
import logoHieroglyphSvg from '@/assets/logoHieroglyph.svg'
</script>

<style lang="scss" scoped>
.logo {
    &__wrapper {
        margin-top: 4px;
    }

    &-img {
        color: var(--accent);
        height: 35px;
        width: 90px;
    }

    &-hieroglyph {
        color: var(--text);
        height: 15px;
        width: 15px;
    }
}
</style>