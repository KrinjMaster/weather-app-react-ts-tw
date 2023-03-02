/// <reference types="vitest" />
/// <reference types="vite/client" />

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  base: '/weather-app-react-ts-tw/',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: '/src/setupTests.ts',
  },
})
