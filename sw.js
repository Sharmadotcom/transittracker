// TransitTrack Service Worker
// Caches static assets and route data for offline use

const CACHE_NAME = 'transittrack-v3';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/index.css',
  '/app.js',
  '/data/routes.js',
  '/simulation/tracker.js',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Cache what we can, ignore failures for external URLs
      return Promise.allSettled(
        STATIC_ASSETS.map(url => cache.add(url).catch(() => {}))
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // Bypass service worker cache for localhost development to prevent stale assets
  if (event.request.url.includes('localhost') || event.request.url.includes('127.0.0.1')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Network-first for tile requests (always want fresh tiles)
  if (event.request.url.includes('tile.openstreetmap.org')) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first for static assets
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      });
    })
  );
});
