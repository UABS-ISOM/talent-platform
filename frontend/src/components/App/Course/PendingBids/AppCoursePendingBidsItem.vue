<template>
  <q-expansion-item
    popup
    default-opened
    :label="`Bid by ${groupName}`"
    :caption="`On ${projectName}, owned by ${projectOwnerName}`"
  >
    <q-separator />
    <q-card>
      <q-card-section>
        <div class="row">
          <div class="q-pa-sm col-12 col-md-6 col-lg-4">
            <q-card flat bordered class="">
              <h2 class="text-h5 q-pa-sm q-my-none">
                {{ projectName }}
              </h2>
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div class="q-pa-sm q-my-none" v-html="projectOverview"></div>
            </q-card>
          </div>

          <div class="q-pa-sm col-12 col-md-6 col-lg-8">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div class="q-pa-sm q-my-none" v-html="bid"></div>
          </div>
        </div>

        <div class="row justify-end">
          <q-btn
            no-caps
            unelevated
            type="submit"
            color="red"
            icon="mdi-close"
            label="Deny"
            class="q-mr-sm"
            :loading="denyLoading"
            :disable="denyLoading || approveLoading"
            @click="approveProject(false)"
          />

          <q-btn
            no-caps
            unelevated
            type="submit"
            color="green"
            icon="mdi-check"
            label="Approve"
            :loading="approveLoading"
            :disable="denyLoading || approveLoading"
            @click="approveProject(true)"
          />
        </div>

        <GenericAlert
          :model-value="error !== null"
          static
          type="error"
          class="full-width q-mt-md"
        >
          {{ getErrorMessage(error) }}
        </GenericAlert>
      </q-card-section>
    </q-card>
  </q-expansion-item>
</template>

<script setup lang="ts">
import GenericAlert from "@/components/GenericAlert.vue";
import { graphql } from "@/gql/__generated__";
import { getErrorMessage } from "@/helpers";
import { useMutation } from "@vue/apollo-composable";
import { ref } from "vue";

const emit = defineEmits<{
  (event: "removedItem"): void;
}>();

const props = defineProps<{
  groupProjectId: string;
  courseId: string;
  bid: string;
  bidStatus: string;
  projectName: string;
  projectOverview: string;
  projectOwnerName: string;
  groupName: string;
}>();

const denyLoading = ref(false);
const approveLoading = ref(false);
const error = ref<any>(null);

// Mutation to save the user's profile
const { mutate } = useMutation(
  graphql(`
    mutation ApproveCourseProjectBidMutation(
      $courseId: ID!
      $groupProjectId: ID!
      $approved: Boolean!
    ) {
      approveCourseProjectBid(
        courseId: $courseId
        groupProjectId: $groupProjectId
        approved: $approved
      ) {
        id
      }
    }
  `)
);

/**
 * Changes the status of the project.
 * @param status Whether to approve the project.
 */
const approveProject = async (approved: boolean) => {
  error.value = null;
  denyLoading.value = true;
  approveLoading.value = true;

  try {
    await mutate({
      courseId: props.courseId,
      groupProjectId: props.groupProjectId,
      approved,
    });
    emit("removedItem");
  } catch (e) {
    error.value = e;
  }
  setTimeout(() => {
    emit("removedItem");
    denyLoading.value = false;
    approveLoading.value = false;
  }, 200);
};
</script>
