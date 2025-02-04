<script setup lang="ts">
import useAuth from "~/composables/auth";

definePageMeta({
  auth: {
    guest: "deny",
    user: "allow",
  },
});

const authClient = useAuth();

async function disconnect() {
  await authClient.signOut({
    fetchOptions: {
      onError: (ctx) => {
        alert(ctx.error.message);
      },
      onSuccess: (ctx) => {
        navigateTo("/", {
          external: true,
        });
      },
    },
  });
}

await disconnect();
</script>

<template>
  <p>You are being redirected. Please wait...</p>
</template>
