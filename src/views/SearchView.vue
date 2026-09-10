<template>
    SearchView query: {{ route.query?.q }}
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';

const route = useRoute()
</script>

<style lang="scss" scoped></style>
