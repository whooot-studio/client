<script setup lang="ts">
defineProps<
  Partial<{
    player: {
      id: string;
      name: string;
      image?: string;
    };
  }>
>();
</script>
<template>
  <UAvatar v-if="player" size="xl" :src="player.image" :alt="player.name" />
  <UAvatar v-else size="xl" alt="user" icon="tabler:user" />
</template>
