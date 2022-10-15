import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 443,
    https: {
      key: fs.readFileSync(path.join(__dirname, "./ssl/each-star.com.key")),
      cert: fs.readFileSync(path.join(__dirname, "./ssl/each-star.com.pem")),
    },
  },
});
