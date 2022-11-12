<template>
  <q-dialog v-model="show">
    <q-card style="width: 420px">
      <q-card-section class="row items-center justify-between">
        <h2 class="text-h6 q-my-none q-mr-sm">Add a Course</h2>

        <q-btn v-close-popup flat round dense icon="mdi-close" />
      </q-card-section>

      <q-separator />

      <q-card-section class="q-pa-sm">
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
            {{ GENERIC_ERROR }}
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
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { RULES, GENERIC_ERROR } from "@/helpers";
import GenericAlert from "@/components/GenericAlert.vue";
import { useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";
import router from "@/router";

const props = defineProps<{
  modelValue?: boolean;
}>();

const emit = defineEmits(["update:modelValue"]);

// Bind model to show ref
const show = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

// Reset dialog on close
watch(show, (value) => {
  if (!value) {
    name.value = "";
    description.value = "";
    error.value = false;
    loading.value = false;
  }
});

// Form values
const name = ref("");
const description = ref("");

// Form status
const error = ref(false);
const loading = ref(false);

const { mutate: addCourse } = useMutation(gql`
  mutation Mutation($name: String!, $description: String!) {
    addCourse(name: $name, description: $description) {
      id
      name
      description
    }
  }
`);

const onSubmit = () => {
  error.value = false;
  loading.value = true;

  addCourse({
    name: name.value,
    description: description.value,
  })
    .then(async (data) => {
      await router.push({
        name: "AppCourse",
        params: { id: data?.data.addCourse.id },
      });
    })
    .catch(() => {
      error.value = true;
    })
    .finally(() => {
      loading.value = false;
    });
};
</script>
