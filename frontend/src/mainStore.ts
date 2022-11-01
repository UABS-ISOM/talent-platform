import { defineStore } from "pinia";
import { ref } from "vue";

interface UserInfo {
  uid: string;
}

export const useMainStore = defineStore("main", () => {
  const user = ref<UserInfo | null>(null);
  const userLoaded = ref(false);

  return { user, userLoaded };
});
