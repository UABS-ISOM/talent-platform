<template>
  <q-layout
    :style="{
      backgroundImage: `url(${background})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      overflowX: 'hidden',
    }"
  >
    <q-page-container>
      <q-page class="row items-center justify-evenly">
        <div class="text-white text-center">
          <GenericAlert :model-value="true" type="error" static>
            We're sorry, an error occured while loading this page. Please check
            your connection and try again later.
          </GenericAlert>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import GenericAlert from "./GenericAlert.vue";
import background from "@/assets/background.jpg";
</script>
