/// <reference types="vitest" />

import { resolve } from 'path'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'Enigamier',
      fileName: 'enigamier',
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
})
