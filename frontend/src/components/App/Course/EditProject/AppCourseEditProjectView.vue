<template>
  <div
    :class="`row items-center justify-between q-py-sm q-pl-${
      $q.screen.lt.md ? 'xl' : 'sm'
    } q-pr-sm`"
    style="gap: 8px"
  >
    <h2 class="text-h4 q-my-none">Project</h2>

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

    <div class="q-pa-sm">
      <q-input
        ref="input"
        v-model="newName"
        :disable="project.status !== CourseProjectStatusEnum.Draft"
        no-error-icon
        hide-bottom-space
        outlined
        dense
        :rules="[RULES.required]"
        type="text"
        label="Project name"
      />
    </div>

    <div class="q-pa-sm">
      <q-form @submit.prevent="save">
        <q-editor
          ref="editor"
          v-model="newOverview"
          :disable="project.status !== CourseProjectStatusEnum.Draft"
          min-height="5rem"
          class="q-mb-md"
          :toolbar="[
            ['bold', 'italic', 'underline'],
            ['quote', 'unordered', 'ordered', 'outdent', 'indent'],
            ['undo', 'redo'],
          ]"
        />

        <GenericAlert
          v-model="saveError"
          type="error"
          class="full-width q-mb-md"
        >
          {{ GENERIC_ERROR }}
        </GenericAlert>

        <div class="row justify-end q-mb-md">
          <q-btn
            no-caps
            unelevated
            :disable="project.status !== CourseProjectStatusEnum.Draft"
            :loading="saveLoading"
            type="submit"
            color="primary"
            icon="mdi-content-save"
            label="Save"
          />
        </div>
      </q-form>
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
</template>

<script setup lang="ts">
import { ref, watch, computed, type VNodeRef } from "vue";
import { useRoute } from "vue-router";
import { useMutation, useQuery } from "@vue/apollo-composable";
import { graphql } from "@/gql/__generated__";
import type { QEditor } from "quasar";
import { GENERIC_ERROR, getErrorMessage, RULES } from "@/helpers";
import GenericAlert from "@/components/GenericAlert.vue";
import { CourseProjectStatusEnum } from "@/gql/__generated__/graphql";

// Get the course ID
const {
  params: { courseId, projectId },
} = useRoute();

// Form values
const newName = ref("");
const newOverview = ref("");

const editor = ref<VNodeRef | null>(null);
const saveLoading = ref(false);
const saveError = ref(false);

const statusLoading = ref(false);

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

/**
 * Saves the new overview.
 */
const save = async () => {
  saveError.value = false;
  saveLoading.value = true;

  try {
    await editProject({
      input: {
        projectId: projectId as string,
        courseId: courseId as string,
        name: newName.value,
        overview: newOverview.value,
      },
    });
    await refetchProject();
  } catch (e) {
    saveError.value = true;
  }

  saveLoading.value = false;
};
</script>
