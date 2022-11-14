<template>
  <q-page class="row content-start">
    <div class="col-12 col-sm-10 col-xl-8 q-mx-auto q-pa-sm">
      <div class="q-px-sm q-py-md">
        <h2 class="text-h4 q-mt-none q-mb-sm">My Courses</h2>

        <p class="q-mb-none">
          These are the courses you're enrolled in as a student. If you can't
          see a course you think you should, please contact your Course
          Coordinator.
        </p>
      </div>

      <AppCoursesNone />

      <div class="q-px-sm q-py-md">
        <div class="row items-center justify-between q-mb-sm q-gutter-sm">
          <h2 class="text-h4 q-my-none">Courses I Run</h2>

          <q-btn
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
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import AppCourseCard from "./AppCourseCard.vue";
import AppCoursesNone from "./AppCoursesNone.vue";
import AppCoursesAddDialog from "./AppCoursesAddDialog.vue";
import CustomDialog from "@/components/CustomDialog.vue";

const showCreateDialog = ref(false);
</script>
