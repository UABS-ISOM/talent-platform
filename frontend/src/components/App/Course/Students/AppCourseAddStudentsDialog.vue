<template>
  <q-form autofocus @submit="onSubmit">
    <p class="q-pa-sm q-mb-none">
      To add multiple students to the course, submit a CSV file where the first
      column denotes the student's name and the second denoted their email. The
      file must have a header row.
    </p>

    <div class="q-pa-sm">
      <q-file v-model="file" outlined accept=".csv" label="Upload CSV">
        <template #prepend>
          <q-icon name="mdi-paperclip" />
        </template>
      </q-file>
    </div>

    <div v-if="exampleStudents.length && !fileError" class="q-pa-sm">
      <q-table
        :rows="exampleStudents"
        :columns="[
          { name: 'row', field: 'row', align: 'left', label: 'Row' },
          { name: 'name', field: 'name', align: 'left', label: 'Name' },
          { name: 'email', field: 'email', align: 'left', label: 'Email' },
        ]"
        row-key="row"
        hide-bottom
        flat
        bordered
      />
    </div>

    <q-card
      v-if="loading"
      class="flex items-center no-wrap q-pa-sm q-ma-sm white-text bg-info"
      flat
      bordered
    >
      <q-icon name="mdi-information-outline" left size="sm" />

      <span style="flex-grow: 1">
        Processed {{ processedStudents }} (and added {{ addedStudents }})
        students out of {{ numStudents }}.
      </span>
    </q-card>

    <GenericAlert v-model="fileError" type="error" class="q-pa-sm">
      {{ fileErrorMessage }}
    </GenericAlert>

    <GenericAlert v-model="success" type="success" class="q-pa-sm">
      Successfully processed {{ numStudents }} students.
    </GenericAlert>

    <GenericAlert v-model="error" type="error" class="q-pa-sm">
      {{ getErrorMessage(addCourseStudentsError) }}
    </GenericAlert>

    <div class="q-pa-sm">
      <q-btn
        no-caps
        unelevated
        :loading="loading"
        :disable="fileError || !file"
        type="submit"
        color="primary"
        class="full-width"
        icon="mdi-plus"
        label="Add students"
      />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { getErrorMessage } from "@/helpers";
import GenericAlert from "@/components/GenericAlert.vue";
import { useMutation } from "@vue/apollo-composable";
import { graphql } from "@/gql/__generated__";
import type { CourseMemberInput } from "@/gql/__generated__/graphql";
import { computed } from "vue";

const props = defineProps<{
  courseId: string;
}>();

const emit = defineEmits<{
  (e: "addStudent"): void;
}>();

// Form values
const file = ref<File | null>(null);
const students = ref<CourseMemberInput[]>([]);

// Form status
const fileError = ref(false);
const fileErrorMessage = ref("");
const error = ref(false);
const success = ref(false);
const loading = ref(false);
const numStudents = ref(0);
const processedStudents = ref(0);
const addedStudents = ref(0);

// Process a file upload
watch(file, (v) => {
  if (v) {
    fileError.value = false;
    const reader = new FileReader();
    reader.addEventListener(
      "load",
      () => {
        if (reader.result === null) return;

        students.value = [];

        reader.result
          .toString()
          .split(/\r?\n/)
          .slice(1)
          .forEach((row, index) => {
            const [name, email] = row.split(",");

            // Ensure that an email is provided
            if (email === "" || email === undefined) {
              fileErrorMessage.value = `Row ${index + 2} is missing an email.`;
              fileError.value = true;
            }

            if (students.value.findIndex((s) => s.email === email) !== -1) {
              fileErrorMessage.value = `Row ${
                index + 2
              } has a duplicate email.`;
              fileError.value = true;
            }

            students.value.push({
              name,
              email,
            });
          });

        if (students.value.length === 0) {
          fileErrorMessage.value = "No students were found in the file.";
          fileError.value = true;
        }
      },
      { once: true }
    );
    reader.readAsText(v);
  }
});

// Display example students in table
const exampleStudents = computed(() => {
  if (students.value.length === 0) return [];
  const examples = [];

  if (students.value[0]) {
    examples.push({
      row: 2,
      name: students.value[0].name,
      email: students.value[0].email,
    });
  }

  if (students.value[1]) {
    examples.push({
      row: 3,
      name: students.value[1].name,
      email: students.value[1].email,
    });
  }

  if (students.value.length > 2 && students.value[students.value.length - 1]) {
    examples.push({
      row: students.value.length + 1,
      name: students.value[students.value.length - 1].name,
      email: students.value[students.value.length - 1].email,
    });
  }

  return examples;
});

const { mutate: addCourseStudents, error: addCourseStudentsError } =
  useMutation(
    graphql(`
      mutation AddCourseStudentsMutation(
        $courseId: ID!
        $members: [CourseMemberInput!]!
      ) {
        addCourseMembers(
          courseId: $courseId
          members: $members
          type: STUDENT
        ) {
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

/**
 * Add students from the uploaded CSV.
 */
const onSubmit = async () => {
  console.log(students.value);
  if (loading.value) return;

  error.value = false;
  success.value = false;
  loading.value = true;

  // Parse student names and emails
  numStudents.value = students.value.length;

  // Loop through ten lots of students at a time
  for (let i = 0; i < students.value.length; i += 10) {
    const nextStudents = students.value.slice(i, i + 10).filter((s) => s.email);

    try {
      // Add the course and redirect to the course page
      const data = await addCourseStudents({
        courseId: props.courseId,
        members: nextStudents,
      });

      processedStudents.value += nextStudents.length;
      addedStudents.value += data?.data?.addCourseMembers.length ?? 0;
    } catch {
      // Cancel successive operations
      error.value = true;
      break;
    }

    if (processedStudents.value === numStudents.value) {
      success.value = true;
      emit("addStudent");
    }
  }

  loading.value = false;
};
</script>
