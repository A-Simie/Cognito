import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  server: {
    proxy: {
      "/cognito": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },
    },
    allowedHosts: ["dishonest-lead.outray.app"],
  },
});
