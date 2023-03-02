<template>
  <div class="q-pa-sm">
    <q-input
      ref="input"
      v-model="newName"
      :disable="disable"
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
        :disable="disable"
        min-height="5rem"
        class="q-mb-md"
        :toolbar="[
          ['bold', 'italic', 'underline'],
          ['quote', 'unordered', 'ordered', 'outdent', 'indent'],
          ['undo', 'redo'],
        ]"
      />

      <GenericAlert v-model="saveError" type="error" class="full-width q-mb-md">
        {{ GENERIC_ERROR }}
      </GenericAlert>

      <div class="row justify-end q-mb-md">
        <q-btn
          no-caps
          unelevated
          :disable="disable"
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

<script setup lang="ts">
import { ref, watch, type VNodeRef } from "vue";
import { useMutation } from "@vue/apollo-composable";
import { graphql } from "@/gql/__generated__";
import type { QEditor } from "quasar";
import { GENERIC_ERROR, RULES } from "@/helpers";
import GenericAlert from "@/components/GenericAlert.vue";

// Get the course ID
const props = defineProps<{
  projectId: string;
  courseId: string;
  name: string;
  overview: string;
  disable: boolean;
}>();

const emits = defineEmits<{
  (event: "refetch"): void;
}>();

// Form values
const newName = ref("");
const newOverview = ref("");

const editor = ref<VNodeRef | null>(null);
const saveLoading = ref(false);
const saveError = ref(false);

watch(
  [() => props.name, () => props.overview],
  () => {
    newName.value = props.name ?? "";
    newOverview.value = props.overview ?? "";
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
 * Saves the new overview.
 */
const save = async () => {
  saveError.value = false;
  saveLoading.value = true;

  try {
    await editProject({
      input: {
        projectId: props.projectId,
        courseId: props.courseId,
        name: newName.value,
        overview: newOverview.value,
      },
    });
    emits("refetch");
  } catch (e) {
    saveError.value = true;
  }

  saveLoading.value = false;
};
</script>
