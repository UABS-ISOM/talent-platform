<template>
  <div
    :class="`row items-center justify-between q-py-sm q-pl-${
      $q.screen.lt.md ? 'xl' : 'sm'
    } q-pr-sm`"
    style="gap: 8px"
  >
    <h2 class="text-h4 q-my-none">Find Students</h2>

    <SearchBox v-model="query" @search="search" />
  </div>

  <div class="row content-start q-pa-sm">
    <template v-if="students !== undefined && error === null">
      <AppCourseFindStudentsCard
        v-for="{ id, photoUrl, name, overview, skills } in students"
        :id="id"
        :key="id"
        :photo-url="photoUrl"
        :name="name"
        :overview="overview"
        :skills="skills"
      />

      <div class="full-width q-pa-sm">
        <GenericNone v-if="students.length === 0">
          There aren't any students enrolled in this course.
        </GenericNone>
      </div>
    </template>

    <template v-else-if="loading || error">
      <template v-if="loading">
        <AppCourseFindStudentsCardLoader v-for="i in 3" :key="i" />
      </template>

      <GenericAlert
        :model-value="error !== null"
        static
        type="error"
        class="full-width"
      >
        {{ getErrorMessage(error) }}
      </GenericAlert>
    </template>
  </div>
</template>

<script setup lang="ts">
import { getErrorMessage } from "@/helpers";
import GenericAlert from "@/components/GenericAlert.vue";
import { useQuery } from "@vue/apollo-composable";
import { graphql } from "@/gql/__generated__";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import GenericNone from "@/components/GenericNone.vue";
import AppCourseFindStudentsCard from "./AppCourseFindStudentsCard.vue";
import AppCourseFindStudentsCardLoader from "./AppCourseFindStudentsCardLoader.vue";
import SearchBox from "@/components/SearchBox.vue";

const {
  params: { courseId },
} = useRoute();

const query = ref("");

const queryParams = ref({
  courseId: courseId as string,
  options: { query: null } as { query: string | null },
});

const search = () => {
  queryParams.value.options.query = query.value;
};

// Query the course
const { result, loading, error } = useQuery(
  graphql(`
    query getFindCourseStudents($courseId: ID!, $options: SearchInput!) {
      courseStudents(courseId: $courseId, options: $options) {
        id
        photoUrl
        name
        overview
        skills
      }
    }

    input SearchInput {
      query: String
    }
  `),
  queryParams,
  { fetchPolicy: "cache-and-network" }
);
const students = computed(() => result.value?.courseStudents);
</script>
