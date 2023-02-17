<template>
  <q-expansion-item popup default-opened>
    <!-- 
    :label="name"
    :caption="`Submitted by ${ownerName}`" -->
    <q-separator />
    <q-card>
      <q-card-section>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <p class="truncated-paragraph q-mb-none" v-html="bid" />

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
  projectId: string;
  courseId: string;
  bid: string;
  bidStatus: string;
}>();

const denyLoading = ref(false);
const approveLoading = ref(false);
const error = ref<any>(null);

// Mutation to save the user's profile
const { mutate } = useMutation(
  graphql(`
    mutation ApproveCourseProjectMutation(
      $courseId: ID!
      $projectId: ID!
      $approved: Boolean!
    ) {
      approveCourseProject(
        courseId: $courseId
        projectId: $projectId
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

  // try {
  //   await mutate({
  //     projectId: props.projectId as string,
  //     courseId: props.courseId as string,
  //     approved,
  //   });
  //   emit("removedItem");
  // } catch (e) {
  //   error.value = e;
  // }
  setTimeout(() => {
    emit("removedItem");
    denyLoading.value = false;
    approveLoading.value = false;
  }, 200);
};
</script>
