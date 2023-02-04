<template>
  <GenericPage>
    <div class="q-px-sm q-py-md">
      <h2 class="text-h4 q-mt-none q-mb-sm">My Courses</h2>

      <p class="q-mb-none">
        These are the courses you're enrolled in as a student. If you can't see
        a course you think you should, please contact your Course Coordinator.
      </p>
    </div>

    <div class="row content-start">
      <template v-if="studentCourses !== undefined">
        <AppCourseCard
          v-for="{ id, name, description } in studentCourses"
          :id="id"
          :key="id"
          :name="name"
          :description="description"
        />

        <div class="full-width">
          <GenericNone v-if="studentCourses.length === 0">
            You're not enrolled in any courses.
          </GenericNone>
        </div>
      </template>

      <template v-else-if="loading || error">
        <template v-if="loading">
          <AppCourseCardLoader v-for="i in 3" :key="i" />
        </template>

        <GenericAlert
          :model-value="error !== null"
          static
          type="error"
          class="full-width"
        >
          {{ getErrorMessage(error) }}
        </GenericAlert>
      </template>
    </div>

    <template v-if="repCourses !== undefined && repCourses.length > 0">
      <div class="q-px-sm q-py-md">
        <h2 class="text-h4 q-mt-none q-mb-sm">Courses I Contribute To</h2>

        <p class="q-mb-none">
          These are the courses you can submit projects for students to bid on
          as a company representative.
        </p>
      </div>

      <div class="row content-start">
        <AppCourseCard
          v-for="{ id, name, description } in repCourses"
          :id="id"
          :key="id"
          :name="name"
          :description="description"
        />
      </div>
    </template>

    <template
      v-if="
        mainStore.userClaims?.staff ||
        (adminCourses !== undefined && adminCourses.length > 0)
      "
    >
      <div class="q-px-sm q-py-md">
        <div class="row items-center justify-between q-mb-sm" style="gap: 8px">
          <h2 class="text-h4 q-my-none">Courses I Help Run</h2>

          <q-btn
            v-if="mainStore.userClaims?.staff"
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
        <template v-if="adminCourses !== undefined">
          <AppCourseCard
            v-for="{ id, name, description } in adminCourses"
            :id="id"
            :key="id"
            :name="name"
            :description="description"
          />

          <div class="full-width">
            <GenericNone v-if="adminCourses.length === 0">
              You don't administer any courses.
            </GenericNone>
          </div>
        </template>

        <template v-else-if="loading || error">
          <template v-if="loading">
            <AppCourseCardLoader v-for="i in 3" :key="i" />
          </template>

          <GenericAlert
            :model-value="error !== null"
            static
            type="error"
            class="full-width"
          >
            {{ getErrorMessage(error) }}
          </GenericAlert>
        </template>
      </div>
    </template>
  </GenericPage>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import AppCourseCard from "./AppCourseCard.vue";
import GenericNone from "@/components/GenericNone.vue";
import AppCoursesAddDialog from "./AppCoursesAddDialog.vue";
import CustomDialog from "@/components/CustomDialog.vue";
import GenericPage from "@/components/GenericPage.vue";
import { useMainStore } from "@/mainStore";
import { graphql } from "@/gql/__generated__";
import { useQuery } from "@vue/apollo-composable";
import AppCourseCardLoader from "./AppCourseCardLoader.vue";
import { getErrorMessage } from "@/helpers";
import GenericAlert from "@/components/GenericAlert.vue";

const showCreateDialog = ref(false);
const mainStore = useMainStore();

// Get the user's profile
const {
  result: studentResult,
  loading,
  error,
} = useQuery(
  graphql(`
    query getStudentCourses {
      me {
        id
        studentCourses {
          id
          name
          description
        }
        adminCourses {
          id
          name
          description
        }
        repCourses {
          id
          name
          description
        }
      }
    }
  `),
  null,
  { fetchPolicy: "cache-and-network" }
);
const studentCourses = computed(
  () => studentResult.value?.me.studentCourses ?? undefined
);
const adminCourses = computed(
  () => studentResult.value?.me.adminCourses ?? undefined
);
const repCourses = computed(
  () => studentResult.value?.me.repCourses ?? undefined
);
</script>
