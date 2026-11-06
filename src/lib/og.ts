import { existsSync } from 'node:fs';

// Прев'ю статті аналітики для соцмереж: public/og/analytics/<id>.<lang>.png (генерує scripts/og-analytics.mjs).
// Немає файлу — сторінка бере загальне site.ogImage.
export function ogImage(id: string, lang: string): string | undefined {
  const path = `/og/analytics/${id}.${lang}.png`;
  return existsSync(`public${path}`) ? path : undefined;
}
