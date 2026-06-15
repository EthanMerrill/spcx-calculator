import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
  output: 'static',
  site: 'https://howmuchspcx.com',
  // base: '/spcx-calculator',
});
