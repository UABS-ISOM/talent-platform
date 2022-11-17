<template>
  <GenericPage>
    <div class="q-px-sm q-py-md">
      <h2 class="text-h4 q-mt-none q-mb-sm">My Courses</h2>

      <p class="q-mb-none">
        These are the courses you're enrolled in as a student. If you can't see
        a course you think you should, please contact your Course Coordinator.
      </p>
    </div>

    <div class="q-pa-sm">
      <GenericNone>You're not enrolled in any courses.</GenericNone>
    </div>

    <div class="q-px-sm q-py-md">
      <div class="row items-center justify-between q-mb-sm" style="gap: 8px">
        <h2 class="text-h4 q-my-none">Courses I Help Run</h2>

        <q-btn
          v-if="mainStore.userClaims?.staff === true"
          no-caps
          unelevated
          color="primary"
          icon="mdi-plus"
          label="Add course"
          @click="showCreateDialog = true"
        />

        <CustomDialog v-model="showCreateDialog" title="Add a Course">
          <AppCoursesAddDialog />
        </CustomDialog>
      </div>

      <p class="q-mb-none">
        These are the courses you administer. You can create a course if you
        have an auckland.ac.nz email address.
      </p>
    </div>

    <div class="row content-start">
      <AppCourseCard />
      <AppCourseCard />
    </div>
  </GenericPage>
</template>

<script setup lang="ts">
import { ref } from "vue";
import AppCourseCard from "./AppCourseCard.vue";
import GenericNone from "@/components/GenericNone.vue";
import AppCoursesAddDialog from "./AppCoursesAddDialog.vue";
import CustomDialog from "@/components/CustomDialog.vue";
import GenericPage from "@/components/GenericPage.vue";
import { useMainStore } from "@/mainStore";

const showCreateDialog = ref(false);

const mainStore = useMainStore();
</script>
