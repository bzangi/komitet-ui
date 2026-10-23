import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'
import pkg from './package.json' with { type: 'json' }

const external = [...Object.keys(pkg.peerDependencies), ...Object.keys(pkg.dependencies)]

export default defineConfig({
  plugins: [react()],
  build: {
    lib: { entry: 'src/build-entry.ts', formats: ['es'], fileName: 'komitet-ui', cssFileName: 'komitet-ui' },
    rolldownOptions: { external: id => external.some(dep => id === dep || id.startsWith(`${dep}/`)) },
  },
  test: {
    projects: [
      {
        extends: true,
        plugins: [storybookTest({ configDir: '.storybook' })],
        test: {
          name: 'storybook',
          browser: { enabled: true, headless: true, provider: playwright(), instances: [{ browser: 'chromium' }] },
        },
      },
    ],
  },
})
