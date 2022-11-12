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
        <div class="text-white text-center q-pa-sm">
          <h1 class="q-my-sm">404</h1>

          <div class="q-pa-sm">
            <GenericAlert :model-value="true" type="error" static>
              We're sorry, this page doesn't exist.
            </GenericAlert>
          </div>

          <div class="q-pa-sm">
            <q-btn
              no-caps
              unelevated
              to="/"
              color="primary"
              label="Take me home!"
            />
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import GenericAlert from "./GenericAlert.vue";
import background from "@/assets/background.jpg";
</script>
