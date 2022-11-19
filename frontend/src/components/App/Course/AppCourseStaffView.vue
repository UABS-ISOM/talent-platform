<template>
  <h2
    :class="`text-h4 q-px-${$q.screen.lt.md ? 'xl' : 'sm'} q-py-sm q-my-none`"
  >
    Staff
  </h2>

  <q-table
    ref="tableRef"
    v-model:pagination="pagination"
    title="Treats"
    :rows="rows"
    :columns="columns"
    row-key="id"
    :loading="loading"
    :filter="search"
    binary-state-sort
    class="q-ma-sm"
    flat
    bordered
    @request="onRequest"
  >
    <template #top-right>
      <q-input
        v-model="search"
        borderless
        dense
        debounce="300"
        placeholder="Search"
      >
        <template #append>
          <q-icon name="mdi-magnify" />
        </template>
      </q-input>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { QTableProps } from "quasar";

const tableRef = ref();
const loading = ref(false);
const pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 3,
  rowsNumber: 10,
});

const search = ref("");
const rows = ref([{ name: "Yeet", role: "Student" }]);
const columns: QTableProps["columns"] = [
  {
    name: "name",
    label: "Name",
    align: "left",
    field: "name",
    sortable: true,
  },
  { name: "role", label: "Role", align: "left", field: "role", sortable: true },
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
