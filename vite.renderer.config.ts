import { defineConfig } from "vite"
import path from "path"

// https://vitejs.dev/config
export default defineConfig(async () => {
  const vue = (await import("@vitejs/plugin-vue")).default
  const tailwindcss = (await import("@tailwindcss/vite")).default
  return {
    plugins: [vue(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  }
})
