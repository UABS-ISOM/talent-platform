<template>
  <q-layout>
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>{{ APP_NAME }}</q-toolbar-title>

        <q-btn
          no-caps
          stretch
          flat
          label="Courses"
          :to="{ name: 'AppCourses' }"
        />

        <q-btn flat round dense icon="mdi-dots-vertical">
          <q-menu>
            <q-list style="min-width: 100px; max-width: 200px">
              <q-item>
                <q-item-section style="word-break: break-word">
                  Hi there,
                  {{ auth.currentUser?.displayName ?? auth.currentUser?.email }}
                </q-item-section>
              </q-item>

              <q-item v-close-popup clickable :to="{ name: 'AppProfile' }">
                <q-item-section avatar>
                  <q-icon name="mdi-account" />
                </q-item-section>

                <q-item-section>My Profile</q-item-section>
              </q-item>

              <q-item v-close-popup clickable @click="handleSignOut">
                <q-item-section avatar>
                  <q-icon name="mdi-logout" />
                </q-item-section>

                <q-item-section>Sign Out</q-item-section>
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
