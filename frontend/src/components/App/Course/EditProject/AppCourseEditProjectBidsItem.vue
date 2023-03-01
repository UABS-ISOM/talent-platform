<template>
  <q-expansion-item popup default-opened :label="`Bid by ${groupName}`">
    <q-separator />
    <q-card class="row">
      <q-card-section class="q-pa-sm col-12 col-md-6 col-lg-8">
        <q-card-section v-if="bid === ''" class="text-grey-6">
          There isn't an overview for this project.
        </q-card-section>

        <!-- eslint-disable-next-line vue/no-v-html -->
        <p v-else class="truncated-paragraph q-mb-none" v-html="bid" />
      </q-card-section>

      <q-card-section class="q-pa-sm col-12 col-md-6 col-lg-4">
        <q-card flat bordered class="q-pa-sm">
          <AppCourseGroupDialog
            :name="groupName"
            :users="users"
            :course-id="courseId"
            :group-id="groupId"
          />
        </q-card>
      </q-card-section>
    </q-card>
  </q-expansion-item>
</template>

<script setup lang="ts">
import type { GetCourseChatQuery } from "@/gql/__generated__/graphql";
import AppCourseGroupDialog from "../AppCourseGroupDialog.vue";

defineProps<{
  bid: string;
  groupId: string;
  groupName: string;
  users: GetCourseChatQuery["courseChat"]["users"];
  courseId: string;
}>();
</script>
