// Лише для Workers Logs: кожен виклик потрапляє в Observability, відповідь — статичний файл.
// _redirects тут не діє (воркер іде першим), тому переадресації — в коді.

// Заголовки безпеки для сторінок (/_astro/* минає скрипт — це лише CSS).
// Власного JS на сайті немає, тому script-src дозволяє лише скрипти, які вбудовує сам Cloudflare
// (JavaScript Detections / Precursor, /cdn-cgi/…, Web Analytics): він бере nonce із заголовка CSP і ставить
// його своїм <script>. Nonce — новий на кожен запит. Шрифти — Google Fonts; style-src 'unsafe-inline' — бо
// Astro вставляє <style> і атрибути style="".
const csp = (nonce) => [
  "default-src 'self'",
  `script-src 'self' 'nonce-${nonce}' https://static.cloudflareinsights.com`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  'font-src https://fonts.gstatic.com',
  "img-src 'self'",
  "connect-src 'self' https://cloudflareinsights.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ');

const security = {
  'Strict-Transport-Security': 'max-age=31536000',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
};

const nonce = () => btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(16))));

const secure = (res) => {
  const out = new Response(res.body, res);
  for (const [k, v] of Object.entries(security)) out.headers.set(k, v);
  out.headers.set('Content-Security-Policy', csp(nonce()));
  return out;
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    // Боти шукають карту сайту за стандартною адресою, а @astrojs/sitemap створює sitemap-index.xml.
    if (url.pathname === '/sitemap.xml') {
      // Відносний Location (RFC 9110): адреса не залежить від запиту — завжди той самий домен.
      return secure(new Response(null, { status: 301, headers: { Location: '/sitemap-index.xml' } }));
    }
    return secure(await env.ASSETS.fetch(request));
  },
};
