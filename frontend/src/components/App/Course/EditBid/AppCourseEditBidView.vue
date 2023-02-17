<template>
  <div
    :class="`row items-center justify-between q-py-sm q-pl-${
      $q.screen.lt.md ? 'xl' : 'sm'
    } q-pr-sm`"
    style="gap: 8px"
  >
    <h2 class="text-h4 q-my-none">
      Bid<template v-if="project?.name !== undefined"
        >: {{ project.name }}</template
      >
    </h2>

    <template v-if="project !== undefined">
      <q-btn
        v-if="
          project?.groupProject?.bidStatus ===
            CourseProjectBidStatusEnum.Draft ||
          project?.groupProject?.bidStatus ===
            CourseProjectBidStatusEnum.Rejected
        "
        no-caps
        unelevated
        color="primary"
        icon="mdi-send"
        label="Send to lecturer"
        :loading="statusLoading"
        :disable="statusLoading"
        @click="changeStatus(CourseProjectBidStatusEnum.Pending)"
      />

      <q-btn
        v-else-if="
          project?.groupProject?.bidStatus ===
            CourseProjectBidStatusEnum.Pending ||
          project?.groupProject?.bidStatus ===
            CourseProjectBidStatusEnum.PendingRep
        "
        no-caps
        unelevated
        color="red"
        icon="mdi-close"
        label="Withdraw post"
        :loading="statusLoading"
        :disable="statusLoading"
        @click="changeStatus(CourseProjectBidStatusEnum.Draft)"
      />
    </template>
  </div>

  <template v-if="project !== undefined">
    <div class="q-pa-sm">
      <template
        v-if="
          project?.groupProject?.bidStatus === CourseProjectBidStatusEnum.Draft
        "
      >
        This bid is currently a draft. Only you can see it.
      </template>

      <template
        v-else-if="
          project?.groupProject?.bidStatus ===
          CourseProjectBidStatusEnum.Pending
        "
      >
        This bid is currently sitting with course staff to approve it to be sent
        to the company representative.
      </template>

      <template
        v-else-if="
          project?.groupProject?.bidStatus ===
          CourseProjectBidStatusEnum.Rejected
        "
      >
        This bid was rejected by course staff to be sent to the company
        representative.
      </template>

      <template
        v-else-if="
          project?.groupProject?.bidStatus ===
          CourseProjectBidStatusEnum.PendingRep
        "
      >
        This bid is currently sitting with the company representative to be
        considered.
      </template>

      <template
        v-else-if="
          project?.groupProject?.bidStatus ===
          CourseProjectBidStatusEnum.RejectedRep
        "
      >
        This bid was rejected by the company representative.
      </template>

      <template
        v-else-if="
          project?.groupProject?.bidStatus ===
          CourseProjectBidStatusEnum.ApprovedRep
        "
      >
        This bid was approved by the company representative.
      </template>
    </div>

    <div class="row">
      <div class="q-pa-sm col-12 col-md-6 col-lg-4">
        <q-card flat bordered class="">
          <h2 class="text-h5 q-pa-sm q-my-none">
            {{ project.name }}
          </h2>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="q-pa-sm q-my-none" v-html="project.overview"></div>
        </q-card>
      </div>
      <div class="q-pa-sm col-12 col-md-6 col-lg-8">
        <q-form @submit.prevent="save">
          <q-editor
            ref="editor"
            v-model="newOverview"
            :disable="
              project?.groupProject?.bidStatus !==
              CourseProjectBidStatusEnum.Draft
            "
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
              :disable="
                project?.groupProject?.bidStatus !==
                CourseProjectBidStatusEnum.Draft
              "
              :loading="saveLoading"
              type="submit"
              color="primary"
              icon="mdi-content-save"
              label="Save"
            />
          </div>
        </q-form>
      </div>
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
import { GENERIC_ERROR, getErrorMessage } from "@/helpers";
import GenericAlert from "@/components/GenericAlert.vue";
import { CourseProjectBidStatusEnum } from "@/gql/__generated__/graphql";

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
    query getCourseGroupProject($courseId: ID!, $projectId: ID!) {
      courseProject(courseId: $courseId, projectId: $projectId) {
        id
        name
        overview
        groupProject {
          id
          bid
          bidStatus
        }
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
// const { mutate: editGroupProject } = useMutation(
//   graphql(`
//     mutation EditGroupProjectMutation($input: EditCourseProjectInput!) {
//       editCourseProject(input: $input) {
//         id
//         name
//         overview
//         status
//       }
//     }

//     input EditCourseProjectInput {
//       projectId: ID!
//       courseId: ID!
//       name: String!
//       overview: String
//     }
//   `)
// );

/**
 * Changes the status of the project.
 * @param status The new status of the project.
 */
const changeStatus = async (status: CourseProjectBidStatusEnum) => {
  // saveError.value = false;
  // statusLoading.value = true;
  // try {
  //   await editGroupProject({
  //     input: {
  //       projectId: projectId as string,
  //       courseId: courseId as string,
  //       status,
  //     },
  //   });
  //   await refetchProject();
  // } catch (e) {
  //   saveError.value = true;
  // }
  // statusLoading.value = false;
};

/**
 * Saves the new overview.
 */
const save = async () => {
  saveError.value = false;
  saveLoading.value = true;

  // try {
  //   await editGroupProject({
  //     input: {
  //       projectId: projectId as string,
  //       courseId: courseId as string,
  //       name: newName.value,
  //       overview: newOverview.value,
  //     },
  //   });
  //   await refetchProject();
  // } catch (e) {
  //   saveError.value = true;
  // }

  saveLoading.value = false;
};
</script>
