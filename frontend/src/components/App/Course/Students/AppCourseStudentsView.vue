<template>
  <div
    :class="`row items-center justify-between q-py-sm q-pl-${
      $q.screen.lt.md ? 'xl' : 'sm'
    } q-pr-sm`"
    style="gap: 8px"
  >
    <h2 class="text-h4 q-my-none">Students</h2>

    <q-space />

    <q-btn
      no-caps
      outline
      color="primary"
      icon="mdi-paperclip"
      label="Add students"
      @click="showAddStudentsDialog = true"
    />

    <q-btn
      no-caps
      unelevated
      color="primary"
      icon="mdi-plus"
      label="Add student"
      @click="showAddStudentDialog = true"
    />

    <CustomDialog v-model="showAddStudentsDialog" title="Add Students">
      <AppCourseAddStudentsDialog
        :course-id="(courseId as string)"
        @add-student="refetch"
      />
    </CustomDialog>

    <CustomDialog v-model="showAddStudentDialog" title="Add Student">
      <AppCourseAddStudentDialog
        :course-id="(courseId as string)"
        @add-student="refetch"
      />
    </CustomDialog>
  </div>

  <template v-if="loading || error">
    <GenericAlert
      :model-value="error !== null"
      static
      type="error"
      class="full-width q-pa-sm"
    >
      {{ getErrorMessage(error) }}
    </GenericAlert>
  </template>

  <q-table
    ref="tableRef"
    v-model:pagination="pagination"
    :rows="students ?? []"
    :columns="columns"
    row-key="id"
    :loading="loading"
    binary-state-sort
    class="q-ma-sm"
    flat
    bordered
    @request="onRequest"
    @row-click="onRowClick"
  >
  </q-table>

  <CustomDialog
    v-model="showStudentDialog"
    :title="studentDialogName"
    width="min(calc(100vw - 1rem), 90vw)"
  >
    <AppCourseFindStudentsStudent
      :course-id="(courseId as string)"
      :uid="studentDialogId"
    />
  </CustomDialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { QTableProps } from "quasar";
import { useQuery } from "@vue/apollo-composable";
import { graphql } from "@/gql/__generated__";
import { useRoute } from "vue-router";
import { computed } from "vue";
import { getErrorMessage } from "@/helpers";
import GenericAlert from "@/components/GenericAlert.vue";
import CustomDialog from "@/components/CustomDialog.vue";
import AppCourseAddStudentsDialog from "./AppCourseAddStudentsDialog.vue";
import AppCourseAddStudentDialog from "./AppCourseAddStudentDialog.vue";
import AppCourseFindStudentsStudent from "../FindStudents/AppCourseFindStudentsStudent.vue";

const showAddStudentsDialog = ref(false);
const showAddStudentDialog = ref(false);

const studentDialogName = ref("");
const studentDialogId = ref("");
const showStudentDialog = ref(false);

const onRowClick: QTableProps["onRowClick"] = (_, { id, name }) => {
  studentDialogId.value = id;
  studentDialogName.value = name;
  showStudentDialog.value = true;
};

// Get the course ID
const {
  params: { courseId },
} = useRoute();

const tableRef = ref();

// Table columns
const columns: QTableProps["columns"] = [
  {
    name: "name",
    label: "Name",
    align: "left",
    field: "name",
  },
  {
    name: "email",
    label: "Email",
    align: "left",
    field: "email",
  },
  {
    name: "group",
    label: "Group",
    align: "left",
    field: "group",
  },
];

// Get the course
const pagination = ref<QTableProps["pagination"]>({
  page: 1,
  rowsPerPage: 50,
  rowsNumber: 0,
});

const queryParams = computed(() => {
  return {
    courseId: courseId as string,
    courseStudentOptions: {
      page: pagination.value?.page ?? 1,
      rowsPerPage: pagination.value?.rowsPerPage ?? 1,
    },
  };
});

// Query the course
const { result, loading, error, refetch } = useQuery(
  graphql(`
    query getCourseStudents(
      $courseId: ID!
      $courseStudentOptions: PaginationInput
    ) {
      course(
        courseId: $courseId
        courseStaffOptions: null
        courseStudentOptions: $courseStudentOptions
      ) {
        numStudents
        students {
          id
          group {
            name
          }
          user {
            name
            email
          }
        }
      }
    }

    input PaginationInput {
      page: Int!
      rowsPerPage: Int!
    }
  `),
  queryParams,
  { fetchPolicy: "cache-and-network" }
);
const course = computed(() => result.value?.course ?? undefined);
const students = computed(
  () =>
    result.value?.course?.students.map((s) => ({
      id: s.id,
      name: s.user.name,
      email: s.user.email,
      group: s.group?.name,
    })) ?? undefined
);

// Update the number of rows in the table
watch(
  () => course.value?.numStudents,
  (numStaff) => {
    if (pagination.value === undefined) return;
    pagination.value.rowsNumber = numStaff;
  }
);

/**
 * Processes a request from the table
 * @param props The table props
 */
const onRequest: QTableProps["onRequest"] = async ({
  pagination: { page, rowsPerPage },
}) => {
  if (pagination.value === undefined) return;

  // Set new query parameters
  pagination.value.page = page;
  pagination.value.rowsPerPage = rowsPerPage;
};
</script>
