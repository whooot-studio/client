<script setup lang="ts">
const code = ref<string>("");

const router = useRouter();
const join = () => {
  if (!code.value) return;

  router.push(`/room/${code.value}`);
};
</script>

<template>
  <UContainer :ui="{ constrained: 'max-w-3xl space-y-2' }">
    <p class="text-2xl">Join a room</p>

    <div class="flex gap-4">
      <UInput
        type="text"
        size="lg"
        v-model="code"
        placeholder="Enter room code"
      />
      <UButton @click="join" size="lg">Join</UButton>
    </div>
  </UContainer>
</template>
