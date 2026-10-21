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
      // xhtml:link alternates для кожної сторінки: uk — у корені, en — під /en/
      i18n: { defaultLocale: 'uk', locales: { uk: 'uk-UA', en: 'en-US' } },
      serialize(item) {
        const date = lastmod.get(new URL(item.url).pathname);
        if (date) item.lastmod = date;
        return item;
      },
    }),
  ],
});
