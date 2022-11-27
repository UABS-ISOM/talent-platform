<template>
  <q-form autofocus @submit="onSubmit">
    <div class="q-pa-sm">
      <q-input
        v-model="name"
        no-error-icon
        hide-bottom-space
        :rules="[RULES.required]"
        type="text"
        placeholder="BUSMGT 761"
        label="Course code"
      />
    </div>

    <div class="q-pa-sm">
      <q-input
        v-model="description"
        no-error-icon
        hide-bottom-space
        :rules="[RULES.required]"
        type="text"
        placeholder="Business Management"
        label="Course description"
      />
    </div>

    <GenericAlert v-model="error" type="error" class="q-pa-sm">
      {{ getErrorMessage(addCourseError) }}
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
        label="Add course"
      />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { RULES, getErrorMessage } from "@/helpers";
import GenericAlert from "@/components/GenericAlert.vue";
import { useMutation } from "@vue/apollo-composable";
import router from "@/router";
import { graphql } from "@/gql/__generated__";

// Form values
const name = ref("");
const description = ref("");

// Form status
const error = ref(false);
const loading = ref(false);

const { mutate: addCourse, error: addCourseError } = useMutation(
  graphql(`
    mutation AddCourseMutation($name: String!, $description: String!) {
      addCourse(name: $name, description: $description) {
        id
      }
    }
  `)
);

const onSubmit = async () => {
  error.value = false;
  loading.value = true;

  try {
    // Add the course and redirect to the course page
    const data = await addCourse({
      name: name.value,
      description: description.value,
    });

    if (data?.data)
      await router.push({
        name: "AppCourseStaff",
        params: { courseId: data.data.addCourse.id },
      });
  } catch (e) {
    error.value = true;
    loading.value = false;
  }
};
</script>
