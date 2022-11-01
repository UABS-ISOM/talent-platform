import { defineStore } from "pinia";
import { ref } from "vue";
import type { User } from "firebase/auth";

export const useMainStore = defineStore("main", () => {
  const user = ref<User | null>(null);
  const userLoaded = ref(false);

  return { user, userLoaded };
});
