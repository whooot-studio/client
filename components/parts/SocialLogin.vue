<script setup lang="ts">
import useClient from "~/composables/client";
import useAuth from "~/composables/auth";

const { client: authClient } = useAuth();
const client = useClient();

type Provider = Parameters<typeof authClient.signIn.social>[0]["provider"];
async function connectProvider(provider: Provider) {
  await authClient.signIn.social({
    provider: provider,
    callbackURL: `${client.origin}/settings/profile`,
    fetchOptions: {
      onError: (ctx) => {
        alert(ctx.error.message);
      },
    },
  });
}

async function connectProviderCustom(provider: string) {
  await authClient.signIn.oauth2({
    providerId: provider,
    callbackURL: `${client.origin}/settings/profile`,
    fetchOptions: {
      onError: (ctx) => {
        console.error(ctx.error);
        alert(ctx.error.message || ctx.error);
      },
    },
  });
}
</script>

<template>
  <UButton
    label="Google"
    color="white"
    icon="logos:google-icon"
    @click="connectProvider('google')"
  ></UButton>
  <UButton
    label="Twitch"
    color="purple"
    icon="tabler:brand-twitch"
    @click="connectProvider('twitch')"
  ></UButton>
  <UButton
    label="Discord"
    color="blurple"
    icon="tabler:brand-discord-filled"
    @click="connectProvider('discord')"
  ></UButton>
  <UButton
    label="SimpleLogin"
    color="pink"
    icon="simple-icons:simplelogin"
    @click="connectProviderCustom('simplelogin')"
  ></UButton>
</template>
