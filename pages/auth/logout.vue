<script setup lang="ts">
import useAuth from "~/composables/auth";

definePageMeta({
  auth: {
    guest: "deny",
    user: "allow",
  },
});

const { client: authClient } = useAuth();

async function disconnect() {
  await authClient.signOut({
    fetchOptions: {
      onError: (ctx) => {
        console.error(ctx.error);
        alert(ctx.error.message || ctx.error);
      },
      onSuccess: (ctx) => {
        navigateTo("/");
      },
    },
  });
}

await disconnect();
</script>

<template>
  <p>You are being redirected. Please wait...</p>
</template>
