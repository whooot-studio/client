<script setup lang="ts">
definePageMeta({
  auth: {
    guest: "deny",
    user: "allow",
  },
});

import useApi from "~/composables/api";

const { endpoints } = useApi();
const list = `${endpoints.quiz}/list`;

const { data, error, status } = useFetch<
  {
    id: number;
    type: string;
    name: string;
    author: string;
    questions: {
      question: string;
      options: string[];
      answer: string;
    }[];
  }[]
>(list, {
  credentials: "include",
});
</script>

<template>
  <div>
    <h1>Quiz</h1>
    <div v-if="error">
      <UCard>
        <p>{{ error }}</p>
      </UCard>
    </div>
    <div v-else-if="status === 'success'">
      <div v-for="quiz in data" :key="quiz.id">
        <UCard>
          <h2>{{ quiz.name }}</h2>
          <p>{{ quiz.author }}</p>

          <UButton :to="`/quiz/${quiz.id}/admin`">Launch quiz!</UButton>
        </UCard>
      </div>
    </div>
  </div>
</template>
