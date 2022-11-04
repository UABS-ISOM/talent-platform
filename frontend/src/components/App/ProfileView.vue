<template>
  <q-page class="row items-center justify-evenly"> User profile page. </q-page>
</template>

<script setup lang="ts">
import { watch } from "vue";
import { useQuery } from "@vue/apollo-composable";
import gql from "graphql-tag";

// Get current user
const { result, loading, error, refetch } = useQuery(gql`
  query ExampleQuery {
    _
    me {
      name
      email
    }
  }
`);

watch(
  () => [result.value, loading.value, error.value],
  (v) => {
    console.log(v);
  }
);

setTimeout(() => {
  refetch();
}, 5000);
</script>
