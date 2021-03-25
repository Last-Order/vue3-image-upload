import * as fs from "fs";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        VitePWA({
            registerType: "autoUpdate",
            manifest: {
                name: "iKP Image Service",
                short_name: "iis",
                start_url: ".",
            },
        }),
    ],
    server: {
        https: {
            key: fs.readFileSync(".ssh/server.local.key"),
            cert: fs.readFileSync(".ssh/server.local.crt"),
        },
        port: 3000,
    },
});
