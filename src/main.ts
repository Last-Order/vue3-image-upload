import { createApp } from "vue";
// @ts-ignore
import { registerSW } from "virtual:pwa-register";
import App from "./App.vue";

const updateSW = registerSW({
    onOfflineReady() {
        // show a ready to work offline to user
    },
});

createApp(App).mount("#app");
