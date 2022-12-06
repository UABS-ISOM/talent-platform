<template>
  <q-card-section>
    <q-form autofocus @submit="send">
      <q-input v-model="message" outlined dense placeholder="Message...">
        <template #after>
          <q-btn round dense flat icon="mdi-send" type="submit" @click="send" />
        </template>
      </q-input>
    </q-form>
  </q-card-section>
</template>

<script setup lang="ts">
import { ref } from "vue";

const message = ref("");

/**
 * Saves the message to the Firestore collection
 */
const send = () => {};
</script>
