import { defineConfig } from 'astro/config';

// Deployment target is not fixed (see docs/ARCHITECTURE.md). SITE_URL / BASE_PATH
// let any static host (including GitHub Pages under a sub-path) build correctly.
export default defineConfig({
  site: process.env.SITE_URL ?? 'https://openworkplacecommons.org',
  base: process.env.BASE_PATH ?? '/',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
});
