<template>
  <n-layout class="layout">
    <router-view />
  </n-layout>
</template>

<script lang="ts" setup>
</script>

<style lang="scss" scoped>
.layout {
  padding: $base-padding;
  height: calc(100vh - 70px);
}
</style>
