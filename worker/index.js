// Лише для Workers Logs: кожен виклик потрапляє в Observability, відповідь — статичний файл.
export default {
  fetch: (request, env) => env.ASSETS.fetch(request),
};
