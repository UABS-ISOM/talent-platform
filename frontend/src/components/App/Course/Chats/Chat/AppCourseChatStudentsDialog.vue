<template>
  <div v-if="!personal" class="q-pa-sm">
    <q-form autofocus class="q-mb-sm" @submit="submitEditChat">
      <q-input
        v-model="newName"
        hide-bottom-space
        outlined
        type="text"
        label="Name"
        class="q-mb-md"
      >
        <template #after>
          <q-btn
            round
            dense
            flat
            icon="mdi-content-save"
            type="submit"
            :loading="mutateChatLoading"
            @click="submitEditChat"
          />
        </template>
      </q-input>
    </q-form>

    <q-btn
      v-if="
        users.some(
          ({ id, groupId }) =>
            id === auth.currentUser?.uid && groupId === chatId
        )
      "
      no-caps
      unelevated
      style="width: 100%"
      color="red"
      icon="mdi-account-minus"
      label="Leave group with chat members"
      :loading="loading"
      :disable="loading"
      @click="mutate({ courseId, groupId: null })"
    />

    <q-btn
      v-else
      no-caps
      unelevated
      style="width: 100%"
      color="primary"
      icon="mdi-account-plus"
      label="Form a group with chat members"
      :loading="loading"
      :disable="loading"
      @click="mutate({ courseId, groupId: chatId })"
    />
  </div>

  <div style="margin: 0 -8px">
    <q-list separator>
      <q-item-label header>Chat Members</q-item-label>

      <q-item
        v-for="{ id, groupId, user: { photoUrl, name: userName } } in users"
        :key="id"
      >
        <q-item-section avatar>
          <q-avatar>
            <img :src="photoUrl" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ userName }}</q-item-label>
          <q-item-label v-if="groupId === chatId" caption>
            Joined chat as group
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { auth } from "@/firebase";
import type { GetCourseChatQuery } from "@/gql/__generated__/graphql";
import { useMutation } from "@vue/apollo-composable";
import { graphql } from "@/gql/__generated__";

const newName = ref("");

const emits = defineEmits<{
  (e: "update"): void;
}>();

const props = defineProps<{
  courseId: string;
  chatId: string;
  personal: boolean;
  name: string;
  users: GetCourseChatQuery["courseChat"]["users"];
}>();

watch(
  () => props.name,
  (name: string) => {
    newName.value = name;
  },
  { immediate: true }
);

const { mutate, loading, onDone } = useMutation(
  graphql(`
    mutation EditCourseStudentGroup($courseId: ID!, $groupId: ID) {
      editCourseStudentGroup(courseId: $courseId, groupId: $groupId) {
        id
        groupId
      }
    }
  `)
);

const {
  mutate: mutateChat,
  loading: mutateChatLoading,
  onDone: onChatDone,
} = useMutation(
  graphql(`
    mutation EditCourseChatMutation(
      $courseId: ID!
      $chatId: String!
      $name: String!
    ) {
      editCourseChat(courseId: $courseId, chatId: $chatId, name: $name) {
        id
      }
    }
  `)
);

const submitEditChat = () => {
  mutateChat({
    courseId: props.courseId,
    chatId: props.chatId,
    name: newName.value,
  });
};

onDone(() => {
  emits("update");
});

onChatDone(() => {
  emits("update");
});
</script>
