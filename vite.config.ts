/// <reference types="vitest" />

import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'Enigamier',
      fileName: 'enigamier',
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
})
