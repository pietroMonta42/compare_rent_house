import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // GitHub Pages serves this repository below /compare_rent_house/.
  base: process.env.GITHUB_ACTIONS ? '/compare_rent_house/' : '/',
});
