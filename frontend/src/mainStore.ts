import { defineStore } from "pinia";
import { ref } from "vue";

export const useMainStore = defineStore("main", () => {
  const userLoaded = ref(false);

  return { userLoaded };
});
