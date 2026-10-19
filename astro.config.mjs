import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { site } from './site.config.ts';
import { buildLastmod } from './scripts/sitemap-lastmod.mjs';

const lastmod = buildLastmod();

export default defineConfig({
  site: `https://${site.domain}`,
  output: 'static',
  integrations: [
    sitemap({
      serialize(item) {
        const date = lastmod.get(new URL(item.url).pathname);
        if (date) item.lastmod = date;
        return item;
      },
    }),
  ],
});
