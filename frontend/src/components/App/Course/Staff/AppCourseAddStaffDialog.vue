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
      <template v-if="addedEmail">
        Successfully added {{ addedEmail }} to the course.
      </template>
      <template v-else>
        This user is already a staff member in this course.
      </template>
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
        label="Add staff"
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
const addedEmail = ref<string>();

const { mutate: addCourseStaff, error: addCourseStaffError } = useMutation(
  graphql(`
    mutation AddCourseStaffMutation(
      $courseId: ID!
      $members: [CourseMemberInput!]!
    ) {
      addCourseMembers(courseId: $courseId, members: $members, type: STAFF) {
        id
        email
      }
    }

    input CourseMemberInput {
      name: String
      email: String!
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
      members: [{ email: email.value }],
    });

    if (data?.data) {
      success.value = true;
      addedEmail.value = data.data.addCourseMembers[0]?.email;
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
