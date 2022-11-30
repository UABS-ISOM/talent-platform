<template>
  <q-form autofocus @submit="onSubmit">
    <div class="q-pa-sm">
      <q-input
        ref="input"
        v-model="email"
        no-error-icon
        hide-bottom-space
        :rules="[RULES.required]"
        type="email"
        placeholder="john.smith@auckland.ac.nz"
        label="Email address"
      />
    </div>

    <GenericAlert v-model="success" type="success" class="q-pa-sm">
      Successfully added {{ email }} to the course.
    </GenericAlert>

    <GenericAlert v-model="error" type="error" class="q-pa-sm">
      {{ getErrorMessage(addCourseStaffError) }}
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
import { nextTick, ref, type VNodeRef } from "vue";
import { RULES, getErrorMessage } from "@/helpers";
import GenericAlert from "@/components/GenericAlert.vue";
import { useMutation } from "@vue/apollo-composable";
import { graphql } from "@/gql/__generated__";

const props = defineProps<{
  courseId: string;
}>();

const emit = defineEmits<{
  (e: "addStaff"): void;
}>();

const input = ref<VNodeRef | null>(null);

// Form values
const email = ref("");

// Form status
const error = ref(false);
const success = ref(false);
const loading = ref(false);
const addedEmails = ref<string>();

const { mutate: addCourseStaff, error: addCourseStaffError } = useMutation(
  graphql(`
    mutation AddCourseStaffMutation($courseId: ID!, $email: String!) {
      addCourseMember(courseId: $courseId, email: $email, type: STAFF) {
        email
      }
    }

    enum CourseMemberEnum {
      STUDENT
      STAFF
    }
  `)
);

const onSubmit = async () => {
  error.value = false;
  success.value = false;
  loading.value = true;

  try {
    // Add the course and redirect to the course page
    const data = await addCourseStaff({
      courseId: props.courseId,
      email: email.value,
    });

    if (data?.data) {
      success.value = true;
      addedEmails.value = data.data.addCourseMember.email;
      email.value = "";
      emit("addStaff");

      nextTick(() => {
        input.value.resetValidation();
        input.value.focus();
      });
    }
  } catch (e: unknown) {
    error.value = true;
  }

  loading.value = false;
};
</script>
