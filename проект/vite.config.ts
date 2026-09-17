import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// base './' — чтобы dist/index.html открывался с диска и с любого пути:
// кадры лежат отдельными файлами в dist/img, не base64 (контракт дизайнера 13.07.2026).
export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  build: { outDir: 'dist', assetsInlineLimit: 0 },
})
