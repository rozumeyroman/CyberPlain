import { site } from '../../site.config';

// Іконка сайту з кольорів site.config.ts; намальована під сітку 16×16, щоб у вкладці лінії не злипались.
// favicon.ico і apple-touch-icon.png у public/ — растрові копії цього малюнка: при зміні кольорів перегенерувати.
export const GET = () =>
  new Response(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges"><rect width="16" height="16" rx="3" fill="${site.colors.bg}" shape-rendering="geometricPrecision"/><path d="M3.5 3.5h9v9h-9z M5 6.5h6 M5 8.5h6 M5 10.5h4" fill="none" stroke="${site.colors.defense}" stroke-width="1"/></svg>`,
    { headers: { 'Content-Type': 'image/svg+xml' } },
  );
