import { createApp, provide, h } from "vue";
import App from "@/App.vue";
import { DefaultApolloClient } from "@vue/apollo-composable";
import { apolloClient } from "./gql";

import { createPinia } from "pinia";
import "@/firebase";

import { Quasar, Notify } from "quasar";
import quasarLang from "quasar/lang/en-GB";
import quasarIconSet from "quasar/icon-set/mdi-v6";
import "@quasar/extras/mdi-v6/mdi-v6.css"; // Import icon libraries
import "quasar/src/css/index.sass"; // Import Quasar css

import router from "@/router";
import "@/assets/app.scss";
import "animate.css";

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient);
  },

  render: () => h(App),
});

app.use(createPinia());
app.use(router);
app.use(Quasar, {
  plugins: { Notify }, // import Quasar plugins and add here
  lang: quasarLang,
  iconSet: quasarIconSet,
});

app.mount("#app");
