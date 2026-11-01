import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    // Dev only: the API client defaults to a same-origin base URL, so in
    // production Caddy proxies /api and here vite does. `pnpm run api:dev`
    // listens on 8787.
    proxy: {
      "/api": "http://127.0.0.1:8787"
    }
  }
});
