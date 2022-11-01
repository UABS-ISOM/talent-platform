import { createApp } from "vue";
import { createPinia } from "pinia";
import "@/firebase";
import { Quasar } from "quasar";
import quasarLang from "quasar/lang/en-GB";
import quasarIconSet from "quasar/icon-set/mdi-v6";
import "@quasar/extras/mdi-v6/mdi-v6.css"; // Import icon libraries
import "quasar/src/css/index.sass"; // Import Quasar css

import App from "@/App.vue";
import router from "@/router";
import "@/assets/app.scss";
import "animate.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(Quasar, {
  plugins: {}, // import Quasar plugins and add here
  lang: quasarLang,
  iconSet: quasarIconSet,
});

app.mount("#app");
