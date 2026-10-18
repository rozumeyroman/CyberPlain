import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { site } from './site.config.ts';

export default defineConfig({
  site: `https://${site.domain}`,
  output: 'static',
  integrations: [sitemap()],
});
