<template>
  <q-layout>
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>{{ APP_NAME }}</q-toolbar-title>

        <q-btn flat round dense icon="mdi-dots-vertical">
          <q-menu>
            <q-list style="min-width: 100px; max-width: 200px">
              <q-item>
                <q-item-section style="word-break: break-word">
                  Hi there,
                  {{ mainStore.user?.displayName ?? mainStore.user?.email }}
                </q-item-section>
              </q-item>

              <q-item v-close-popup clickable @click="handleSignOut">
                <q-item-section avatar>
                  <q-icon name="mdi-logout" />
                </q-item-section>

                <q-item-section>Sign out</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { getAuth, signOut } from "firebase/auth";
import { GENERIC_ERROR, APP_NAME } from "@/helpers";
import { useMainStore } from "@/mainStore";
import { useQuasar } from "quasar";

const mainStore = useMainStore();

const $q = useQuasar();

/**
 * Signs the user out.
 */
const handleSignOut = () => {
  const auth = getAuth();

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
