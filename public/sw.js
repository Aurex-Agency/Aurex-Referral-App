// Cache only the public offline page. Never cache customer records or authenticated routes.
self.addEventListener('install', event => { event.waitUntil(caches.open('magnolia-offline-v1').then(cache => cache.add('/offline.html'))); self.skipWaiting(); });
self.addEventListener('activate', event => { event.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', event => { if (event.request.mode === 'navigate') event.respondWith(fetch(event.request).catch(() => caches.match('/offline.html'))); });

self.addEventListener('push', event => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch {}
  event.waitUntil(self.registration.showNotification(data.title || 'Magnolia', {
    body: data.body || 'You have a new Magnolia update.',
    icon: '/icon-192.png',
    tag: 'magnolia-demo-' + Date.now(),
    data: { url: '/' }
  }));
});
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const app = windows.find(client => new URL(client.url).pathname === '/');
    if (app) return app.focus();
    return self.clients.openWindow('/');
  })());
});
