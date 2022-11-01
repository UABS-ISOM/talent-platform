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
          <h1>404</h1>
          <p>We're sorry, this page doesn't exist.</p>
          <q-btn
            no-caps
            unelevated
            to="/"
            color="primary"
            label="Take me home!"
          />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import background from "@/assets/background.jpg";
</script>
