<script setup lang="ts">
import type { Particle } from "~/composables/particles";

defineProps<{
  particles: Ref<Particle[]>;
}>();
</script>

<template>
  <div
    class="absolute bottom-0 right-0 flex align-middle justify-center p-2 size-16 select-none touch-manipulation pointer-events-none"
  >
    <p
      v-for="entity in particles.value"
      :key="entity.id"
      class="particle text-xl"
    >
      {{ entity.display }}
    </p>
  </div>
</template>

<style scoped>
.particle {
  position: absolute;
  animation: particle-enter 1s;
}

@keyframes particle-enter {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(-50vh);
    opacity: 0;
  }
}
</style>
