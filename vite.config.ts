import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      COMP: fileURLToPath(new URL('./src/components', import.meta.url))
    }
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: ['src/main.ts', './index.html']
    }
  }
})
