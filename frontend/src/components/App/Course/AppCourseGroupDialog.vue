<template>
  <div style="margin: 0 -8px">
    <q-list separator>
      <template v-if="name">
        <q-item-label header class="q-pb-sm">{{ name }}</q-item-label>
        <q-item-label caption class="q-px-md q-pb-md">
          Group Members
        </q-item-label>
      </template>
      <q-item-label v-else header>Group Members</q-item-label>

      <q-item
        v-for="{ id, user: { photoUrl, name: userName } } in members"
        :key="id"
        clickable
        @click="onClick(id, userName)"
      >
        <q-item-section avatar>
          <q-avatar>
            <img :src="photoUrl" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ userName }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>

  <CustomDialog
    v-model="showStudentDialog"
    :title="studentDialogName"
    width="min(calc(100vw - 1rem), 90vw)"
  >
    <AppCourseFindStudentsStudent
      v-if="showStudentDialog"
      :course-id="(courseId as string)"
      :uid="studentDialogId"
    />
  </CustomDialog>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { GetCourseChatQuery } from "@/gql/__generated__/graphql";
import CustomDialog from "@/components/CustomDialog.vue";
import AppCourseFindStudentsStudent from "./FindStudents/AppCourseFindStudentsStudent.vue";

const props = defineProps<{
  name?: string;
  users: GetCourseChatQuery["courseChat"]["users"];
  courseId: string;
  groupId: string;
}>();

const members = computed(() =>
  props.users.filter((u) => u.groupId === props.groupId)
);

const studentDialogName = ref("");
const studentDialogId = ref("");
const showStudentDialog = ref(false);

const onClick = (id: string, userName: string) => {
  studentDialogId.value = id;
  studentDialogName.value = userName;
  showStudentDialog.value = true;
};
</script>
