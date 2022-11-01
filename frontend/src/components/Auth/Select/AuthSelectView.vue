<template>
  <AuthCard>
    <div class="text-h4 q-py-md">Welcome to {{ APP_NAME }}</div>

    <AuthGoogle />

    <div class="q-my-md" style="padding: 0.5em 0; position: relative">
      <q-separator />

      <div
        class="q-mx-auto full-width text-center"
        style="position: absolute; top: 0; line-height: 1"
      >
        <span class="q-px-sm" style="background-color: #fff">OR</span>
      </div>
    </div>

    <AuthSignIn />
  </AuthCard>
</template>

<script setup lang="ts">
import { APP_NAME } from "@/helpers";
import AuthSignIn from "./AuthSignIn.vue";
import AuthGoogle from "./AuthGoogle.vue";
import AuthCard from "../AuthCard.vue";
</script>
