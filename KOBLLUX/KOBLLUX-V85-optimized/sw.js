/* KOBLLUX V85 · offline-first shell + runtime cache-on-use */
const KOB_CACHE = 'kobllux-v85-optimized-v1';
const KOB_SHELL = [
  './', './index.html', './pwa/manifest.json', './icon-192.png', './precache.json',
  './boot/kob-boot.js',
  './css/bundle-base.css', './css/bundle-fusion.css', './css/bundle-feature.css', './css/bundle-tl.css',
  './css/07-main.css', './css/08-ifsw-unified.css', './css/09-0x01-pulsar-v-d5-2.css',
  './css/10-kob-aura.css', './css/11-main.css', './css/12-nagatanazare.css', './css/13-kxt-solar.css',
  './css/14-partklz.css', './css/15-si-0.css', './css/16-base.css',
  './js/01-kob-perf.js', './js/02-inline.js', './js/03-kob-sw.js'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(KOB_CACHE).then(cache => cache.addAll(KOB_SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('kobllux-') && k !== KOB_CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(caches.match(req).then(cached => {
    if (cached) return cached;
    return fetch(req).then(response => {
      if (response && response.ok && (response.type === 'basic' || response.type === 'default')) {
        const copy = response.clone();
        caches.open(KOB_CACHE).then(cache => cache.put(req, copy)).catch(() => {});
      }
      return response;
    }).catch(() => {
      if (req.mode === 'navigate') return caches.match('./index.html');
      throw new Error('Offline resource not cached: ' + req.url);
    });
  }));
});
