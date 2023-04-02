import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [react()],
    build: { outDir: "./wwwroot/app/", sourcemap: true },
    server: {
      proxy: {
        "/api": {
          target: `http://localhost:${env.VITE_PORT}`,
          changeOrigin: true,
          secure: false,
          withCredentials: true,
        },
      },
    },
  };
});
