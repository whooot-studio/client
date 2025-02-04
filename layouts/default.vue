<script setup lang="ts">
import Navigation from "~/components/parts/Navigation.vue";
</script>

<template>
  <ClientOnly>
    <Navigation class="mb-4" />

    <slot />
  </ClientOnly>
</template>
