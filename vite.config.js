import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ""); // load ALL env vars
  const base = env.VITE_BASE || "/";

  return {
    base,
    plugins: [react()],
  };
});

