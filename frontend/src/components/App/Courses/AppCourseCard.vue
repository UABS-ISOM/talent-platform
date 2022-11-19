<template>
  <router-link
    v-ripple
    :to="{ name: 'AppCourse', params: { id } }"
    class="q-pa-sm col-12 col-sm-6 col-md-4 col-lg-3 text-black"
    style="text-decoration: none"
  >
    <q-card flat bordered>
      <q-card-section>
        <h2 class="text-h6 q-my-none">{{ name }}</h2>
        <div class="text-subtitle2">{{ description }}</div>
      </q-card-section>
    </q-card>
  </router-link>
</template>

<script setup lang="ts">
defineProps<{
  id: string;
  name: string;
  description: string;
}>();
</script>
