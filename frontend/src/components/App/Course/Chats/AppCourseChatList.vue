<template>
  <div
    class="q-py-sm"
    :style="{
      'flex-grow': $q.screen.lt.md ? 1 : undefined,
      width: $q.screen.gt.sm ? '360px' : undefined,
    }"
  >
    <div
      :class="`row justify-between items-center q-mx-sm q-py-sm q-pl-${
        $q.screen.lt.md ? 'xl' : 'sm'
      } q-pr-sm`"
    >
      <h2 class="text-h4 q-my-none">Chats</h2>

      <q-btn
        no-caps
        unelevated
        color="primary"
        icon="mdi-account-multiple-plus"
        label="Create group chat"
        @click="addChat"
      />
    </div>

    <GenericAlert
      :model-value="error !== null"
      static
      type="error"
      class="q-py-sm q-px-md full-width"
    >
      {{ GENERIC_ERROR }}
    </GenericAlert>

    <q-list v-if="loading" class="q-py-sm">
      <q-item v-for="i in 3" :key="i" class="q-px-lg">
        <q-item-section avatar>
          <q-skeleton type="QAvatar" size="40px" animation="fade" />
        </q-item-section>

        <q-item-section>
          <q-item-label>
            <q-skeleton type="text" animation="fade" />
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>

    <q-list v-else-if="chats.length > 0" class="q-py-sm">
      <AppCourseChatListItem
        v-for="{ _id: chatId, lastSentAt } in chats"
        :key="`${chatId}-${lastSentAt}`"
        :chat-id="chatId"
        :course-id="courseId"
        :last-sent-at="lastSentAt"
      />
    </q-list>

    <p v-else-if="error === null" class="q-px-md q-py-sm">
      <GenericNone>
        You don't have any chats yet. Start a conversation from the "Find
        Students" page.
      </GenericNone>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import AppCourseChatListItem from "./AppCourseChatListItem.vue";
import GenericNone from "@/components/GenericNone.vue";
import { watchChats, type CourseChatData } from "./api";
import { auth } from "@/firebase";
import type { QuerySnapshot } from "@firebase/firestore";
import { useMutation } from "@vue/apollo-composable";
import { graphql } from "@/gql/__generated__";
import { useRouter } from "vue-router";
import GenericAlert from "@/components/GenericAlert.vue";
import { GENERIC_ERROR } from "@/helpers";

const router = useRouter();

const props = defineProps<{
  courseId: string;
}>();

const loading = ref(true);
const error = ref<unknown | null>(null);
const chats = ref<CourseChatData[]>([]);

const { mutate } = useMutation(
  graphql(`
    mutation AddCourseChat($courseId: ID!, $uid: String!) {
      addCourseChatMember(courseId: $courseId, uid: $uid) {
        id
      }
    }
  `)
);

const addChat = async () => {
  const chat = await mutate({
    courseId: props.courseId,
    uid: auth.currentUser?.uid ?? "",
  });
  router.push({
    name: "AppCourseChat",
    params: {
      courseId: props.courseId,
      chatId: chat?.data?.addCourseChatMember.id ?? "",
    },
  });
};

/**
 * Loads a new lot of chats.
 * @param snapshot The new document snapshots.
 */
const onNext = (snapshot: QuerySnapshot<CourseChatData>) => {
  loading.value = false;
  chats.value = snapshot.docs.map((d) => d.data());
};

// Watch chat changes
let unsubscribe: (() => void) | undefined = undefined;
onMounted(() => {
  unsubscribe = watchChats(
    props.courseId,
    auth.currentUser?.uid ?? "",
    onNext,
    (e: unknown) => {
      loading.value = false;
      error.value = e;
    }
  );
});
onUnmounted(() => {
  unsubscribe?.();
});
</script>
