// Cache only the public offline page. Never cache customer records or authenticated routes.
self.addEventListener('install', event => { event.waitUntil(caches.open('magnolia-offline-v1').then(cache => cache.add('/offline.html'))); self.skipWaiting(); });
self.addEventListener('activate', event => { event.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', event => { if (event.request.mode === 'navigate') event.respondWith(fetch(event.request).catch(() => caches.match('/offline.html'))); });
