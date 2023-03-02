<template>
  <div
    :class="`row items-center justify-between q-py-sm q-pl-${
      $q.screen.lt.md ? 'xl' : 'sm'
    } q-pr-sm`"
    style="gap: 8px"
  >
    <h2 class="text-h4 q-my-none">Project: {{ project?.name }}</h2>

    <template v-if="project !== undefined">
      <q-btn
        v-if="project?.status === CourseProjectStatusEnum.Draft"
        no-caps
        unelevated
        color="primary"
        icon="mdi-send"
        label="Request to post"
        :loading="statusLoading"
        :disable="statusLoading"
        @click="changeStatus(CourseProjectStatusEnum.Pending)"
      />

      <q-btn
        v-if="project?.status === CourseProjectStatusEnum.Rejected"
        no-caps
        unelevated
        color="primary"
        icon="mdi-send"
        label="Re-request to post"
        :loading="statusLoading"
        :disable="statusLoading"
        @click="changeStatus(CourseProjectStatusEnum.Pending)"
      />

      <q-btn
        v-else-if="project?.status === CourseProjectStatusEnum.Pending"
        no-caps
        unelevated
        color="red"
        icon="mdi-close"
        label="Withdraw request to post"
        :loading="statusLoading"
        :disable="statusLoading"
        @click="changeStatus(CourseProjectStatusEnum.Draft)"
      />

      <q-btn
        v-else-if="project?.status === CourseProjectStatusEnum.Active"
        no-caps
        unelevated
        color="red"
        icon="mdi-close"
        label="Withdraw post"
        :loading="statusLoading"
        :disable="statusLoading"
        @click="changeStatus(CourseProjectStatusEnum.Draft)"
      />
    </template>
  </div>

  <template v-if="project !== undefined">
    <div class="q-pa-sm">
      <template v-if="project?.status === CourseProjectStatusEnum.Draft">
        This project is currently a draft. Only you can see it.
      </template>

      <template
        v-else-if="project?.status === CourseProjectStatusEnum.Rejected"
      >
        You requested to publish this project, but it was rejected by course
        staff.
      </template>

      <template v-else-if="project?.status === CourseProjectStatusEnum.Pending">
        You've requested to publish this project, and it's currently with course
        staff for review.
      </template>

      <template v-else-if="project?.status === CourseProjectStatusEnum.Active">
        This project has been published and is visible to students.
      </template>

      <template v-if="project.status !== CourseProjectStatusEnum.Draft">
        To edit your project, you must first convert it back to a draft.
      </template>
    </div>
  </template>

  <template v-else-if="queryLoading || queryError">
    <template v-if="queryLoading">
      <div class="q-pa-sm">
        <q-skeleton type="QInput" animation="fade" />
      </div>

      <div class="q-pa-sm">
        <q-skeleton v-for="i in 3" :key="i" type="text" animation="fade" />
      </div>
    </template>

    <GenericAlert
      :model-value="queryError !== null"
      static
      type="error"
      class="full-width q-ma-sm"
    >
      {{ getErrorMessage(queryError) }}
    </GenericAlert>
  </template>

  <q-tabs
    v-model="tab"
    dense
    class="text-grey"
    active-color="primary"
    indicator-color="primary"
    align="justify"
    narrow-indicator
    style="margin: 0 -8px"
  >
    <q-tab name="overview" label="Overview" no-caps />
    <q-tab name="bids" label="Bids" no-caps />
  </q-tabs>

  <q-separator style="margin: 0 -8px" />

  <q-tab-panels v-model="tab" animated>
    <q-tab-panel name="overview" class="q-pa-sm">
      <AppCourseEditProjectEdit
        v-if="project !== undefined"
        :course-id="(courseId as string)"
        :project-id="(projectId as string)"
        :name="project.name"
        :overview="project?.overview ?? ''"
        :disable="project.status !== CourseProjectStatusEnum.Draft"
        @refetch="refetchProject"
      />
    </q-tab-panel>

    <q-tab-panel name="bids" class="q-pa-sm">
      <AppCourseEditProjectBids
        v-if="project !== undefined"
        :course-id="(courseId as string)"
        :project-id="(projectId as string)"
      />
    </q-tab-panel>
  </q-tab-panels>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useRoute } from "vue-router";
import { useMutation, useQuery } from "@vue/apollo-composable";
import { graphql } from "@/gql/__generated__";
import { getErrorMessage } from "@/helpers";
import GenericAlert from "@/components/GenericAlert.vue";
import { CourseProjectStatusEnum } from "@/gql/__generated__/graphql";
import AppCourseEditProjectEdit from "./AppCourseEditProjectEdit.vue";
import AppCourseEditProjectBids from "./AppCourseEditProjectBids.vue";

// Get the course ID
const {
  params: { courseId, projectId },
} = useRoute();

// Form values
const newName = ref("");
const newOverview = ref("");

const saveError = ref(false);
const statusLoading = ref(false);

const tab = ref("overview");

// Query the course
const {
  result,
  loading: queryLoading,
  error: queryError,
  refetch: refetchProject,
} = useQuery(
  graphql(`
    query getCourseProject($courseId: ID!, $projectId: ID!) {
      courseProject(courseId: $courseId, projectId: $projectId) {
        id
        name
        overview
        status
      }
    }
  `),
  { courseId: courseId as string, projectId: projectId as string },
  { fetchPolicy: "cache-and-network" }
);

const project = computed(() => result.value?.courseProject);

watch(
  project,
  () => {
    newName.value = project.value?.name ?? "";
    newOverview.value = project.value?.overview ?? "";
  },
  { immediate: true }
);

// Mutation to save the user's profile
const { mutate: editProject } = useMutation(
  graphql(`
    mutation EditProjectMutation($input: EditCourseProjectInput!) {
      editCourseProject(input: $input) {
        id
        name
        overview
        status
      }
    }

    input EditCourseProjectInput {
      projectId: ID!
      courseId: ID!
      name: String!
      overview: String
    }
  `)
);

/**
 * Changes the status of the project.
 * @param status The new status of the project.
 */
const changeStatus = async (status: CourseProjectStatusEnum) => {
  saveError.value = false;
  statusLoading.value = true;

  try {
    await editProject({
      input: {
        projectId: projectId as string,
        courseId: courseId as string,
        status,
      },
    });
    await refetchProject();
  } catch (e) {
    saveError.value = true;
  }

  statusLoading.value = false;
};
</script>
