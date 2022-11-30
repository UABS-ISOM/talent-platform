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
import type { QueryCourseArgs } from "@/gql/__generated__/graphql";

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
];

// Get the course
const pagination = ref<QTableProps["pagination"]>({
  page: 1,
  rowsPerPage: 25,
  rowsNumber: 0,
});

const queryParams = ref<QueryCourseArgs>({
  courseId: courseId as string,
  courseStaffOptions: {
    rowsPerPage: pagination.value?.rowsPerPage ?? 1,
  },
});

/**
 * Processes a request from the table
 * @param props The table props
 */
const onRequest: QTableProps["onRequest"] = async ({
  pagination: { page, rowsPerPage },
}) => {
  if (pagination.value === undefined) return;

  // Set new query parameters
  queryParams.value.courseStaffOptions = {
    page,
    rowsPerPage,
  };
};

// Query the course
const { result, loading, error, refetch } = useQuery(
  graphql(`
    query getCourseStaff($courseId: ID!, $courseStaffOptions: PaginationInput) {
      course(courseId: $courseId, courseStaffOptions: $courseStaffOptions) {
        numStaff
        staff {
          id
          name
        }
      }
    }

    input PaginationInput {
      page: Int
      afterDoc: String
      beforeDoc: String
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
</script>
