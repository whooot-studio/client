<script setup lang="ts">
import useAuth from "~/composables/auth";

const { user, loggedIn } = useAuth();

const links = computed(() => {
  const _links = [
    [
      {
        label: "Home",
        icon: "tabler:home",
        to: "/",
      },
      {
        label: "Quiz",
        icon: "tabler:list",
        to: "/quiz",
        disabled: !loggedIn.value,
      },
    ],
    [
      !loggedIn.value && {
        label: "Register",
        icon: "tabler:user-plus",
        to: "/auth/register",
      },
      !loggedIn.value && {
        label: "Login",
        icon: "tabler:user",
        to: "/auth/login",
      },
      loggedIn.value && {
        label: "Profile",
        to: "/settings/profile",
        avatar: {
          src: user.value?.image as string,
          alt: user.value?.name,
        },
      },
      loggedIn.value && {
        label: "Logout",
        icon: "tabler:logout",
        to: "/auth/logout",
      },
    ],
  ];

  return _links.map((list) => list.filter(Boolean)) as Exclude<
    (typeof _links)[number][number],
    undefined | false
  >[][];
});
</script>

<template>
  <UHorizontalNavigation :links="links" />
</template>
