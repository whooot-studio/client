<script setup lang="ts">
const list = `${ENDPOINTS.quiz}/list`;

const { data, error } = useFetch<
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
  method: "GET",
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
    <div v-else>
      <div v-for="quiz in data" :key="quiz.id">
        <UCard>
          <h2>{{ quiz.name }}</h2>
          <p>{{ quiz.author }}</p>
          <div v-for="(question, index) in quiz.questions" :key="index">
            <p>{{ question.question }}</p>
            <ul>
              <li v-for="(option, index) in question.options" :key="index">
                {{ option }}
              </li>
            </ul>
            <p>{{ question.answer }}</p>
          </div>

          <UButton :to="`/quiz/${quiz.id}/admin`">Launch quiz!</UButton>
        </UCard>
      </div>
    </div>
  </div>
</template>
