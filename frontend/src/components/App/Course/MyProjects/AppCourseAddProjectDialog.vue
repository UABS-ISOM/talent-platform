<template>
  <q-form autofocus @submit="onSubmit">
    <div class="q-pa-sm">
      <q-input
        ref="input"
        v-model="name"
        no-error-icon
        hide-bottom-space
        :rules="[RULES.required]"
        type="text"
        label="Project name"
      />
    </div>

    <GenericAlert v-model="success" type="success" class="q-pa-sm">
      <template v-if="addedEmail">
        Successfully added {{ addedEmail }} to the course.
      </template>
      <template v-else>
        This user is already a staff member in this course.
      </template>
    </GenericAlert>

    <GenericAlert v-model="error" type="error" class="q-pa-sm">
      {{ getErrorMessage(addCourseProjectError) }}
    </GenericAlert>

    <div class="q-pa-sm">
      <q-btn
        no-caps
        unelevated
        :loading="loading"
        type="submit"
        color="primary"
        class="full-width"
        icon="mdi-plus"
        label="Add project"
      />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { ref, type VNodeRef } from "vue";
import { RULES, getErrorMessage } from "@/helpers";
import GenericAlert from "@/components/GenericAlert.vue";
import { useMutation } from "@vue/apollo-composable";
import { graphql } from "@/gql/__generated__";
import { useRouter } from "vue-router";

const props = defineProps<{
  courseId: string;
}>();

const router = useRouter();

const input = ref<VNodeRef | null>(null);

// Form values
const name = ref("");

// Form status
const error = ref(false);
const success = ref(false);
const loading = ref(false);
const addedEmail = ref<string>();

const { mutate: addCourseProject, error: addCourseProjectError } = useMutation(
  graphql(`
    mutation AddCourseProjectMutation($courseId: ID!, $name: String!) {
      addCourseProject(courseId: $courseId, name: $name) {
        id
        name
        overview
        status
      }
    }
  `)
);

const onSubmit = async () => {
  error.value = false;
  success.value = false;
  loading.value = true;

  try {
    // Add the course and redirect to the course page
    const data = await addCourseProject({
      courseId: props.courseId,
      name: name.value,
    });

    if (data?.data) {
      router.push({
        name: "AppCourseEditProject",
        params: { projectId: data.data.addCourseProject.id },
      });
    }
  } catch (e: unknown) {
    error.value = true;
  }

  loading.value = false;
};
</script>
