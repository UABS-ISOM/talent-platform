<template>
  <router-link
    :to="{ name: 'AppCourseFindStudents', params: { courseId: id } }"
    class="q-pa-sm col-12 col-sm-6 col-md-4 col-lg-3 text-black"
    style="text-decoration: none"
  >
    <q-card flat bordered>
      <q-item>
        <q-item-section avatar>
          <q-avatar>
            <img :src="photoUrl" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <h2 class="text-h6 q-my-none">{{ name }}</h2>
        </q-item-section>
      </q-item>

      <q-separator />

      <q-card-section v-if="overview === ''" class="text-grey-6">
        This user hasn't set an overview.
      </q-card-section>

      <q-card-section v-else>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <p class="truncated-paragraph q-mb-none" v-html="overview" />
      </q-card-section>

      <div
        v-if="skills.length > 0"
        class="flex q-px-md q-pb-md"
        style="gap: 8px"
      >
        <q-chip
          v-for="(skill, index) in skills"
          :key="index"
          :ripple="false"
          class="q-ma-none"
        >
          {{ skill }}
        </q-chip>
      </div>
    </q-card>
  </router-link>
</template>

<script setup lang="ts">
defineProps<{
  id: string;
  photoUrl: string;
  name: string;
  overview: string;
  skills: string[];
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
