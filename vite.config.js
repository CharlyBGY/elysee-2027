import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Sur GitHub Pages, l'app est servie sous /elysee-2027/ ; en local, à la racine.
const base = process.env.GITHUB_ACTIONS ? '/elysee-2027/' : '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react()],
})
