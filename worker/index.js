// Лише для Workers Logs: кожен виклик потрапляє в Observability, відповідь — статичний файл.
// _redirects тут не діє (воркер іде першим), тому переадресації — в коді.
export default {
  fetch(request, env) {
    const url = new URL(request.url);
    // Боти шукають карту сайту за стандартною адресою, а @astrojs/sitemap створює sitemap-index.xml.
    if (url.pathname === '/sitemap.xml') {
      return Response.redirect(new URL('/sitemap-index.xml', url), 301);
    }
    return env.ASSETS.fetch(request);
  },
};
