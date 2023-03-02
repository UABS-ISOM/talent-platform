<template>
  <template v-if="mode === 'browse'">
    <div v-if="isStudent" class="text-h6">Browse Projects</div>
    <p>
      Here you can browse projects available to make bids on for this course.
      You can add them to your group's starred list.
    </p>
  </template>

  <template v-else-if="mode === 'starred'">
    <div class="text-h6">Starred Projects</div>
    <p>These are the projects members of your group have starred.</p>
  </template>

  <template v-else>
    <div class="text-h6">Projects with Bids</div>
    <p>These are the projects your group has written bids for.</p>
  </template>

  <template v-if="projects !== undefined && error === null">
    <q-list v-if="projects.length > 0">
      <q-list>
        <AppCourseBrowseProjectsBrowseItem
          v-for="{
            id,
            name,
            overview,
            owner: { name: ownerName },
            groupProject,
          } in projects"
          :key="id"
          :course-id="props.courseId"
          :project-id="id"
          :name="name"
          :overview="overview ?? ''"
          :owner-name="ownerName"
          :starred="groupProject?.starred ?? false"
          :is-student="isStudent"
          :has-bid="!!groupProject?.bid"
        />
      </q-list>
    </q-list>

    <div v-else class="full-width q-pa-sm">
      <GenericNone v-if="mode === 'browse'">
        There aren't any projects available to bid on yet.
      </GenericNone>

      <GenericNone v-else-if="mode === 'starred'">
        Your group hasn't starred any projects yet.
      </GenericNone>

      <GenericNone v-else>
        Your group hasn't started any bids yet.
      </GenericNone>
    </div>
  </template>

  <template v-else-if="loading || error">
    <template v-if="loading">
      <q-skeleton
        v-for="i in 3"
        :key="i"
        size="52px"
        class="full-width q-my-sm"
        animation="fade"
      />
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
</template>

<script setup lang="ts">
import GenericAlert from "@/components/GenericAlert.vue";
import GenericNone from "@/components/GenericNone.vue";
import { graphql } from "@/gql/__generated__";
import { getErrorMessage } from "@/helpers";
import { useQuery } from "@vue/apollo-composable";
import { computed } from "vue";
import AppCourseBrowseProjectsBrowseItem from "./AppCourseBrowseProjectsBrowseItem.vue";

const props = defineProps<{
  courseId: string;
  isStudent: boolean;
  mode: "browse" | "starred" | "bids";
}>();

// Query the course
const { result, loading, error } = useQuery(
  graphql(`
    query getActiveProjects($courseId: ID!) {
      course(courseId: $courseId) {
        id
        activeProjects {
          id
          name
          overview
          owner {
            name
          }
          groupProject {
            id
            bid
            starred
          }
        }
      }
    }
  `),
  {
    courseId: props.courseId as string,
  },
  { fetchPolicy: "cache-and-network" }
);

const projects = computed(() =>
  result.value?.course?.activeProjects.filter((project) => {
    switch (props.mode) {
      case "browse":
        return true;
      case "starred":
        return project.groupProject?.starred ?? false;
      case "bids":
        return !!project.groupProject?.bid;
    }
  })
);
</script>
