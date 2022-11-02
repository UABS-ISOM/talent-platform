<template>
  <q-btn
    no-caps
    flat
    color="primary"
    class="full-width"
    icon="mdi-logout"
    label="Sign out"
    @click="handleSignOut"
  />
</template>

<script setup lang="ts">
import { getAuth, signOut } from "firebase/auth";
import { GENERIC_ERROR } from "@/helpers";
import { useQuasar } from "quasar";

const auth = getAuth();

const $q = useQuasar();

/**
 * Signs the user out.
 */
const handleSignOut = () => {
  signOut(auth).catch(() => {
    // An error occurred
    $q.notify({
      message: GENERIC_ERROR,
      progress: true,
      type: "negative",
      icon: "mdi-alert",
    });
  });
};
</script>
