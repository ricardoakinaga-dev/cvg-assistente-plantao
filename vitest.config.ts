import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@cvg/shift-model-provider': fileURLToPath(
        new URL('./packages/shift-model-provider/src/index.ts', import.meta.url)
      ),
      '@cvg/shared': fileURLToPath(
        new URL('./packages/shared/src/index.ts', import.meta.url)
      )
    }
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    testTimeout: 15000
  }
})
