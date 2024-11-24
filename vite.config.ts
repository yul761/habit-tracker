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
      input: ['src/main.ts', './index.html'],
      output: {
        manualChunks: {
          /// Core vendor dependencies
          'vue-core': ['vue', 'vue-router'],
          'state-management': ['pinia'],

          // Split Firebase SDK
          'firebase-core': ['firebase/app', 'firebase/auth'],
          'firebase-db': ['firebase/firestore'],
          'firebase-functions': ['firebase/functions'],
          // Firebase related code
          firebase: [
            './src/firebase/firebase.base',
            './src/firebase/firebase.habit.db',
            './src/firebase/firebase.user.db',
            './src/api/firebase.functions'
          ],
          // Authentication related components
          auth: [
            './src/components/Authentication/LogInDropdown.vue',
            './src/views/SignUpView.vue',
            './src/views/PasswordResetView.vue',
            './src/stores/auth'
          ],
          // Habit related features
          habits: [
            './src/components/HabitForm/HabitForm.vue',
            './src/components/HabitForm/HabitInfoDetailView.vue',
            './src/components/HabitForm/NewHabitView.vue',
            './src/components/Datatable/HabitTable.vue'
          ],
          // User profile related
          profile: [
            './src/components/UserProfile/UserProfileHeader.vue',
            './src/views/UserProfileView.vue'
          ],
          // Common UI components
          ui: [
            './src/components/BreadCrumb/BreadCrumb.vue',
            './src/components/Dropdown/ButtonDropdown.vue',
            './src/components/Dropdown/TextDropdown.vue',
            './src/components/Header/ViewHeader.vue',
            './src/components/Inputs/PhoneInputs.vue'
          ]
        },
        // Organize output files
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name?.split('.').at(1) ?? 'unknown'
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'img'
          } else if (/woff|woff2/.test(extType)) {
            extType = 'fonts'
          }
          return `assets/${extType}/[name]-[hash][extname]`
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js'
      }
    },
    // Enable source maps for production debugging
    sourcemap: true,
    // Production optimizations
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true
      }
    }
  },
  server: {
    port: 3000,
    hmr: true
  },
  optimizeDeps: {
    include: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/functions']
  }
})
