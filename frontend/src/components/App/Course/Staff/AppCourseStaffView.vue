<template>
  <div
    :class="`row items-center justify-between q-py-sm q-pl-${
      $q.screen.lt.md ? 'xl' : 'sm'
    } q-pr-sm`"
    style="gap: 8px"
  >
    <h2 class="text-h4 q-my-none">Staff</h2>

    <q-btn
      no-caps
      unelevated
      color="primary"
      icon="mdi-plus"
      label="Add staff"
      @click="showAddStaffDialog = true"
    />

    <CustomDialog v-model="showAddStaffDialog" title="Add Staff">
      <AppCourseAddStaffDialog
        :course-id="(courseId as string)"
        @add-staff="refetch"
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
    :rows="course?.staff ?? []"
    :columns="columns"
    row-key="id"
    :loading="loading"
    binary-state-sort
    class="q-ma-sm"
    flat
    bordered
    @request="onRequest"
  >
  </q-table>
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
import AppCourseAddStaffDialog from "./AppCourseAddStaffDialog.vue";

const showAddStaffDialog = ref(false);

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
    courseStaffOptions: {
      page: pagination.value?.page ?? 1,
      rowsPerPage: pagination.value?.rowsPerPage ?? 1,
    },
  };
});

// Query the course
const { result, loading, error, refetch } = useQuery(
  graphql(`
    query getCourseStaff($courseId: ID!, $courseStaffOptions: PaginationInput) {
      course(courseId: $courseId, courseStaffOptions: $courseStaffOptions) {
        numStaff
        staff {
          id
          name
          email
        }
      }
    }

    input PaginationInput {
      page: Int
      rowsPerPage: Int!
    }
  `),
  queryParams,
  { fetchPolicy: "cache-and-network" }
);
const course = computed(() => result.value?.course ?? undefined);

// Update the number of rows in the table
watch(
  () => course.value?.numStaff,
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
