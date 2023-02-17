<template>
  <q-card
    flat
    bordered
    class="flex column no-wrap q-my-md q-mr-md col-grow"
    style="position: sticky; top: 1rem"
  >
    <q-card-section class="row items-center q-pa-sm">
      <q-btn
        v-if="$q.screen.lt.md"
        no-caps
        outline
        color="primary"
        icon="mdi-chevron-left"
        label="Back"
        class="q-ml-xl q-mr-md"
        :to="{ name: 'AppCourseChats' }"
      />

      <div class="row" style="justify-content: space-between; flex-grow: 1">
        <div class="text-h6">Chat with Unnamed User</div>

        <q-btn flat round dense icon="mdi-dots-vertical" @click.prevent>
          <q-menu>
            <q-list style="min-width: 100px; max-width: 200px">
              <q-item v-close-popup clickable>
                <q-item-section avatar>
                  <q-icon name="mdi-account-plus" />
                </q-item-section>

                <q-item-section>Join chat as group</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
    </q-card-section>

    <q-separator />
    <AppCourseChatMessages :course-id="courseId" :chat-id="chatId" />
    <q-separator />
    <AppCourseChatInput :course-id="courseId" :chat-id="chatId" />
  </q-card>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { graphql } from "@/gql/__generated__";
import { useQuery } from "@vue/apollo-composable";
import AppCourseChatInput from "./AppCourseChatInput.vue";
import AppCourseChatMessages from "./AppCourseChatMessages.vue";

const {
  params: { courseId, chatId },
} = useRoute() as unknown as { params: { courseId: string; chatId: string } };

// Ensure the chat exists
// TODO: Show a 404 page if the chat doesn't exist
const { result, loading, error } = useQuery(
  graphql(`
    query getCourseChat($courseId: ID!, $chatId: String!) {
      courseChat(courseId: $courseId, chatId: $chatId) {
        id
      }
    }
  `),
  { courseId: courseId, chatId: chatId },
  { fetchPolicy: "cache-and-network" }
);
</script>
