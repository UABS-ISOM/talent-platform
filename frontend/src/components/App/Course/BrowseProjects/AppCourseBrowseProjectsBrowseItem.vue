<template>
  <q-expansion-item
    popup
    default-opened
    :label="name"
    :caption="`Submitted by ${ownerName}`"
  >
    <q-separator />
    <q-card>
      <q-card-section>
        <q-card-section v-if="overview === ''" class="text-grey-6">
          There isn't an overview for this project.
        </q-card-section>

        <!-- eslint-disable-next-line vue/no-v-html -->
        <p v-else class="truncated-paragraph q-mb-none" v-html="overview" />

        <div v-if="isStudent" class="row justify-end">
          <q-btn
            no-caps
            unelevated
            flat
            :loading="loading"
            :disable="loading"
            type="submit"
            :color="starred ? 'warning' : 'black'"
            icon="mdi-star"
            :label="starred ? 'Unstar' : 'Star'"
            class="q-mr-sm"
            @click="starProject(!newStarred)"
          />

          <q-btn
            :to="{ name: 'AppCourseEditBid', params: { courseId, projectId } }"
            no-caps
            unelevated
            color="primary"
            :icon="hasBid ? 'mdi-gavel' : 'mdi-plus'"
            :label="hasBid ? 'See bid' : 'Create bid'"
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

const props = defineProps<{
  projectId: string;
  courseId: string;
  name: string;
  overview: string;
  ownerName: string;
  starred: boolean;
  isStudent: boolean;
  hasBid: boolean;
}>();

const loading = ref(false);
const error = ref<any>(null);
const newStarred = ref(props.starred);

// Mutation to save the user's profile
const { mutate } = useMutation(
  graphql(`
    mutation EditCourseGroupProjectMutation($input: EditGroupProjectInput!) {
      editCourseGroupProject(input: $input) {
        id
        starred
      }
    }

    input EditGroupProjectInput {
      courseId: ID!
      projectId: ID!
      groupId: ID!
      starred: Boolean
    }
  `)
);

/**
 * Changes the status of the project.
 * @param status Whether to approve the project.
 */
const starProject = async (starred: boolean) => {
  error.value = null;
  loading.value = true;

  try {
    const result = await mutate({
      input: {
        courseId: props.courseId,
        projectId: props.projectId,
        starred: starred,
      },
    });

    newStarred.value =
      result?.data?.editCourseGroupProject.starred ?? newStarred.value;
  } catch (e) {
    error.value = e;
  }

  loading.value = false;
};
</script>
