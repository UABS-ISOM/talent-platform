<template>
  <router-link
    :to="{ name: 'AppCourseEditProject', params: { projectId: id } }"
    class="q-pa-sm col-12 col-sm-6 col-md-4 col-lg-3 text-black"
    style="text-decoration: none"
  >
    <q-card flat bordered>
      <q-item class="column">
        <q-item-section>
          <h2 class="text-h6 q-my-none">{{ name }}</h2>
        </q-item-section>

        <div style="margin: 0 -4px">
          <q-chip
            v-if="status === CourseProjectStatusEnum.Draft"
            color="black"
            text-color="white"
          >
            Draft
          </q-chip>
          <q-chip
            v-else-if="status === CourseProjectStatusEnum.Active"
            color="green"
            text-color="white"
          >
            Active
          </q-chip>
          <q-chip
            v-else-if="status === CourseProjectStatusEnum.Pending"
            color="primary"
            text-color="white"
          >
            Pending
          </q-chip>
          <q-chip
            v-else-if="status === CourseProjectStatusEnum.Rejected"
            color="red"
            text-color="white"
          >
            Rejected
          </q-chip>
        </div>
      </q-item>

      <q-separator />

      <q-card-section v-if="overview === ''" class="text-grey-6">
        You haven't written an overview for this project yet.
      </q-card-section>

      <q-card-section v-else>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <p class="truncated-paragraph q-mb-none" v-html="overview" />
      </q-card-section>
    </q-card>
  </router-link>
</template>

<script setup lang="ts">
import { CourseProjectStatusEnum } from "@/gql/__generated__/graphql";

defineProps<{
  id: string;
  name: string;
  overview: string;
  status: CourseProjectStatusEnum;
}>();
</script>

<style scoped>
.truncated-paragraph {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>
