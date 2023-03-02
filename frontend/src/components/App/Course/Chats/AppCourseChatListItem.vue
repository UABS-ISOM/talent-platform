<template>
  <q-item
    v-ripple
    clickable
    class="q-px-lg"
    :to="{ name: 'AppCourseChat', params: { courseId, chatId } }"
  >
    <q-item-section avatar>
      <q-avatar :icon="chat?.personal ? 'mdi-account' : 'mdi-account-group'" />
    </q-item-section>

    <q-item-section>
      <q-item-label lines="1">
        {{ chat?.name }}
      </q-item-label>
      <q-item-label
        v-if="
          chat?.users.some(
            ({ id, groupId }) =>
              id === auth.currentUser?.uid && groupId === chatId
          )
        "
        caption
      >
        Joined chat as group
      </q-item-label>
    </q-item-section>

    <q-item-section side>
      {{ timeString }}
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { auth } from "@/firebase";
import { graphql } from "@/gql/__generated__";
import { formatTimeDiff } from "@/helpers";
import { useQuery } from "@vue/apollo-composable";
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

const props = defineProps<{
  chatId: string;
  courseId: string;
  lastSentAt: number;
}>();

// Ensure the chat exists
// TODO: Show a 404 page if the chat doesn't exist
const { result } = useQuery(
  graphql(`
    query getCourseChat($courseId: ID!, $chatId: String!) {
      courseChat(courseId: $courseId, chatId: $chatId) {
        id
        personal
        name
        users {
          id
          groupId
          user {
            id
            photoUrl
            name
          }
        }
      }
    }
  `),
  { courseId: props.courseId, chatId: props.chatId },
  { fetchPolicy: "cache-and-network" }
);

const chat = computed(() => result.value?.courseChat);

// Update current time every minute
const timeInterval = ref<number | undefined>();
const currentTime = ref(new Date().getTime());

onMounted(() => {
  timeInterval.value = setInterval(() => {
    currentTime.value = new Date().getTime();
  }, 60000); // Recalculate every minute
});

onBeforeUnmount(() => clearInterval(timeInterval.value));

const timeString = computed(() =>
  formatTimeDiff(currentTime.value - props.lastSentAt)
);
</script>
