import { defineConfig } from 'vite'
import { execSync } from 'node:child_process'
import react from '@vitejs/plugin-react'

const shortSha = (() => {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim()
  } catch {
    return 'unknown'
  }
})()

// Relative base so the build works under a GitHub Pages project path.
export default defineConfig({
  base: './',
  plugins: [react()],
  define: {
    __COMMIT_SHA__: JSON.stringify(shortSha),
  },
})
