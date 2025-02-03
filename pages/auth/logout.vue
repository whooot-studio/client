<script setup lang="ts">
import authClient from "~/lib/auth";

definePageMeta({
  auth: {
    guest: "deny",
    user: "allow",
  },
});

const router = useRouter();

async function disconnect() {
  await authClient.signOut({
    fetchOptions: {
      onError: (ctx) => {
        alert(ctx.error.message);
      },
      onSuccess: (ctx) => {
        router.push("/");
      },
    },
  });
}

await disconnect();
</script>

<template>
  <p>Logging out...</p>
</template>
