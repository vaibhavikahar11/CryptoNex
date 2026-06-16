import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    // Proxy API requests to API Gateway during development
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
      "/chat": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/usercoins": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/usercoinPortfolio": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
