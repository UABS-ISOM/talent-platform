<template>
  <q-card-section>
    <q-form autofocus @submit="send">
      <q-input v-model="message" outlined dense placeholder="Message...">
        <template #after>
          <q-btn
            round
            dense
            flat
            icon="mdi-send"
            type="submit"
            :loading="loading"
            @click="send"
          />
        </template>
      </q-input>
    </q-form>
  </q-card-section>
</template>

<script setup lang="ts">
import { graphql } from "@/gql/__generated__";
import { useMutation } from "@vue/apollo-composable";
import { ref } from "vue";

const props = defineProps<{
  courseId: string;
  chatId: string;
}>();

const message = ref("");

const { mutate: addCourseChatMessage, loading } = useMutation(
  graphql(`
    mutation AddCourseChatMessageMutation(
      $courseId: ID!
      $chatId: String!
      $message: String!
    ) {
      addCourseChatMessage(
        courseId: $courseId
        chatId: $chatId
        message: $message
      ) {
        id
      }
    }
  `)
);

/**
 * Saves the message to the Firestore collection
 */
const send = () => {
  addCourseChatMessage({
    courseId: props.courseId,
    chatId: props.chatId,
    message: message.value,
  });
  message.value = "";
};
</script>
