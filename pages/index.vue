<script setup lang="ts">
import authClient from "~/lib/auth";

const { useSession } = authClient;
const session = useSession();

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

async function create() {
  const { data, error } = await authClient.signUp.email(
    {
      email: "test@example.org",
      password: "$uper-pa$$123",
      name: "test",
    },
    {
      onError: (ctx) => {
        alert(ctx.error.message);
      },
    }
  );
}

async function connect() {
  const { data, error } = await authClient.signIn.email({
    email: "test@example.org",
    password: "$uper-pa$$123",
    rememberMe: true,
  });
}

async function disconnect() {
  const { data, error } = await authClient.signOut();
}
</script>

<template>
  <UHorizontalNavigation :links="links" />

  <div v-if="session.data && session.data.user">
    <p>Hello, {{ session.data.user.name }}</p>
    <button @click="disconnect">Sign out</button>
  </div>
  <p v-else>
    <button @click="connect">Sign in</button>
    <button @click="create">Sign up</button>
  </p>
</template>
