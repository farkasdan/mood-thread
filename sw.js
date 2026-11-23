const CACHE = 'mood-thread-d15e144d41';
const FILES = ['./', 'index.html', 'manifest.webmanifest', 'fonts/figtree-latin-1.woff2', 'fonts/figtree-latin-ext-0.woff2', 'fonts/fraunces-latin-1.woff2', 'fonts/fraunces-latin-ext-0.woff2', 'fonts/outfit-latin-1.woff2', 'fonts/outfit-latin-ext-0.woff2', 'icons/apple-touch-icon.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
/* the page itself: network first so updates arrive, the cache when offline. Everything else: cache first. */
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  if (e.request.mode === 'navigate') { e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put('index.html', copy)); return r; }).catch(() => caches.match('index.html'))); return; }
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request)));
});
