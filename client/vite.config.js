import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const port = Number(env.CLIENT_PORT || 3000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("CLIENT_PORT must be an integer from 1 to 65535");
  }

  const proxyTarget = env.API_PROXY_TARGET || "http://127.0.0.1:8000";
  const url = new URL(proxyTarget);
  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("API_PROXY_TARGET must be an HTTP or HTTPS URL");
  }

  return {
    plugins: [react()],
    server: {
      host: "127.0.0.1",
      port,
      strictPort: true,
      proxy: {
        "/api": {
          target: url.origin,
          changeOrigin: true,
        },
      },
    },
    test: {
      environment: "jsdom",
      setupFiles: ["./src/test/setup.js"],
    },
  };
});
