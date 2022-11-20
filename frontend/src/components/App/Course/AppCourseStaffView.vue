<template>
  <h2
    :class="`text-h4 q-px-${$q.screen.lt.md ? 'xl' : 'sm'} q-py-sm q-my-none`"
  >
    Staff
  </h2>

  <q-table
    ref="tableRef"
    v-model:pagination="pagination"
    :rows="rows"
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
import { onMounted, ref } from "vue";
import type { QTableProps } from "quasar";
import { useQuery } from "@vue/apollo-composable";
import { graphql } from "@/gql/__generated__";
import { useRoute } from "vue-router";
import { computed } from "vue";

// Get the course ID
const {
  params: { courseId },
} = useRoute();

const tableRef = ref();

// Get the course
const pagination = ref<QTableProps["pagination"]>({
  page: 1,
  rowsPerPage: 3,
  rowsNumber: 10,
});

const queryParams = computed(() => {
  return {
    courseId: courseId as string,
  };
});

// Query the course
const { result, loading, error, ...args } = useQuery(
  graphql(`
    query getCourseStaff($courseId: ID!) {
      course(courseId: $courseId) {
        staff {
          name
        }
      }
    }
  `),
  queryParams,
  { fetchPolicy: "cache-and-network" }
);
const staff = computed(() => result.value?.course?.staff ?? undefined);

const search = ref("");
const rows = ref([{ name: "Yeet", role: "Student" }]);
const columns: QTableProps["columns"] = [
  {
    name: "name",
    label: "Name",
    align: "left",
    field: "name",
  },
  { name: "role", label: "Role", align: "left", field: "role" },
];

const onRequest = async (props: {
  pagination: {
    page: number;
    rowsPerPage: number;
    sortBy: string;
    descending: boolean;
  };
  filter: string;
}) => {
  loading.value = true;
  console.log(props);
};

onMounted(() => {
  // get initial data from server (1st page)
  tableRef.value.requestServerInteraction();
});
</script>
