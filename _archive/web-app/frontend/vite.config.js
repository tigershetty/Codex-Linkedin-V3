import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // During local development, proxy /api calls to the FastAPI backend
      // Remove this in production (Vercel handles the API URL via env var)
    },
  },
});
