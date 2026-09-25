import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages project sites are served from /<repository-name>/.
// VITE_BASE_PATH can override this for previews or custom deployments.
const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1];
const base = process.env.VITE_BASE_PATH ?? (repositoryName ? `/${repositoryName}/` : '/');

export default defineConfig({
  plugins: [react()],
  base,
})
