<script setup lang="ts">
const links = [
  [
    {
      label: "quiz",
      icon: "i-heroicons-home",
      to: "/quiz",
    },
  ],
  [],
];
</script>

<template>
  <UHorizontalNavigation :links="links" />
</template>
