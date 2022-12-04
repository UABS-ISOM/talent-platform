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

      <template v-else-if="studentLoading || studentError">
        <template v-if="studentLoading">
          <AppCourseCardLoader v-for="i in 3" :key="i" />
        </template>

        <GenericAlert
          :model-value="studentError !== null"
          static
          type="error"
          class="full-width"
        >
          {{ getErrorMessage(studentError) }}
        </GenericAlert>
      </template>
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

      <template v-else-if="adminLoading || adminError">
        <template v-if="adminLoading">
          <AppCourseCardLoader v-for="i in 3" :key="i" />
        </template>

        <GenericAlert
          :model-value="adminError !== null"
          static
          type="error"
          class="full-width"
        >
          {{ getErrorMessage(adminError) }}
        </GenericAlert>
      </template>
    </div>
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
  loading: studentLoading,
  error: studentError,
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
      }
    }
  `),
  null,
  { fetchPolicy: "cache-and-network" }
);
const studentCourses = computed(
  () => studentResult.value?.me.studentCourses ?? undefined
);

// Get the user's profile
const {
  result: adminResult,
  loading: adminLoading,
  error: adminError,
} = useQuery(
  graphql(`
    query getAdminCourses {
      me {
        id
        adminCourses {
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
const adminCourses = computed(
  () => adminResult.value?.me.adminCourses ?? undefined
);
</script>
