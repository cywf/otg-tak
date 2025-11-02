import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://cywf.github.io/otg-tak',
  base: '/otg-tak',
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  outDir: './dist',
  publicDir: './public',
});
