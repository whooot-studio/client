<script setup lang="ts">
import useAuth from "~/composables/auth";

const { useSession } = useAuth();
const session = useSession();

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
        disabled: !session.value.data?.user,
      },
    ],
    [
      !session.value.data?.user && {
        label: "Register",
        icon: "tabler:user-plus",
        to: "/auth/register",
      },
      !session.value.data?.user && {
        label: "Login",
        icon: "tabler:user",
        to: "/auth/login",
      },
      session.value.data?.user && {
        label: "Profile",
        to: "/settings/profile",
        avatar: {
          src: session.value.data.user.image as string,
          alt: session.value.data.user.name,
        },
      },
      session.value.data?.user && {
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
