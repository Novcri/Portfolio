import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import devServer from '@hono/vite-dev-server'
import cloudflareAdapter from '@hono/vite-dev-server/cloudflare'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true, // Dockerコンテナ外からアクセスできるように 0.0.0.0 をバインド
  },
  plugins: [
    react(),
    tailwindcss(),
    devServer({
      entry: 'functions/api/[[route]].ts',
      adapter: cloudflareAdapter,
      exclude: [
        /^\/(?!api).*/,
      ],
    })
  ],
})
