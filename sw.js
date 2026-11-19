
/* VelvetScore · Actualización de caché, versión 2 */
const VERSION = 'velvetscore-v2-20261119';

const ARCHIVOS = [
  './',
  './index.html',
  './styles.css',
  './news2.js',
  './app.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(VERSION).then(cache => cache.addAll(ARCHIVOS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();

    await Promise.all(
      keys
        .filter(key =>
          key !== VERSION &&
          (
            key.startsWith('news2-') ||
            key.startsWith('velvetscore-')
          )
        )
        .map(key => caches.delete(key))
    );

    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  if (
    request.method !== 'GET' ||
    url.origin !== self.location.origin
  ) return;

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);

        if (response.ok) {
          const cache = await caches.open(VERSION);
          await cache.put('./index.html', response.clone());
        }

        return response;
      } catch (_) {
        return (
          (await caches.match('./index.html')) ||
          (await caches.match('./')) ||
          Response.error()
        );
      }
    })());

    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;

    const response = await fetch(request);

    if (response.ok) {
      const cache = await caches.open(VERSION);
      await cache.put(request, response.clone());
    }

    return response;
  })());
});
