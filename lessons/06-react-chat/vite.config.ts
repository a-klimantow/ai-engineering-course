import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  server: {
    // Запросы /api/... Vite перенаправляет на наш сервер из server.ts
    proxy: { "/api": "http://localhost:3002" },
  },
})
