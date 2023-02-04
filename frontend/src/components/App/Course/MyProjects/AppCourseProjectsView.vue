<template>
  <div
    :class="`row items-center justify-between q-py-sm q-pl-${
      $q.screen.lt.md ? 'xl' : 'sm'
    } q-pr-sm`"
    style="gap: 8px"
  >
    <h2 class="text-h4 q-my-none">My Projects</h2>

    <q-btn
      no-caps
      unelevated
      color="primary"
      icon="mdi-plus"
      label="Add project"
      @click="showAddProjectDialog = true"
    />

    <CustomDialog v-model="showAddProjectDialog" title="Add Project">
      <AppCourseAddProjectDialog :course-id="(courseId as string)" />
    </CustomDialog>
  </div>

  <div class="row content-start q-pa-sm">
    <template v-if="projects !== undefined && error === null">
      <AppCourseProjectsCard
        v-for="{ id, name, overview, status } in projects"
        :id="id"
        :key="id"
        :name="name"
        :overview="overview ?? ''"
        :status="status"
      />

      <div class="full-width q-pa-sm">
        <GenericNone v-if="projects.length === 0">
          You don't have any projects in this course.
        </GenericNone>
      </div>
    </template>

    <template v-else-if="loading || error">
      <template v-if="loading">
        <AppCourseProjectsCardLoader v-for="i in 3" :key="i" />
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

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import CustomDialog from "@/components/CustomDialog.vue";
import AppCourseAddProjectDialog from "./AppCourseAddProjectDialog.vue";
import { getErrorMessage } from "@/helpers";
import GenericAlert from "@/components/GenericAlert.vue";
import { useQuery } from "@vue/apollo-composable";
import { graphql } from "@/gql/__generated__";
import GenericNone from "@/components/GenericNone.vue";
import AppCourseProjectsCard from "./AppCourseProjectsCard.vue";
import AppCourseProjectsCardLoader from "./AppCourseProjectsCardLoader.vue";

const showAddProjectDialog = ref(false);

// Get the course ID
const {
  params: { courseId },
} = useRoute();

const queryParams = ref({
  courseId: courseId as string,
  options: { query: null } as { query: string | null },
});

// Query the course
const { result, loading, error } = useQuery(
  graphql(`
    query getMyProjects($courseId: ID!) {
      course(courseId: $courseId) {
        id
        myProjects {
          id
          name
          overview
          status
        }
      }
    }
  `),
  queryParams,
  { fetchPolicy: "cache-and-network" }
);

const projects = computed(() => result.value?.course?.myProjects);
</script>
