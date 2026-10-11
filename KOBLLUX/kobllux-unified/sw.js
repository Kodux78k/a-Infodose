/* KOBLLUX · Service Worker · offline-first
   Local = fonte principal. CDN/infodose = cache em runtime (stale-while-revalidate).
   Suba VERSION a cada release para invalidar caches antigos. */
const VERSION = 'kob-unified-1';
const CACHE = VERSION;

/* Shell + vendor locais (cada item é tolerante a falha: arquivo ausente não quebra a instalação) */
const LOCAL = [
  './', './index.html',
  './vendor/Tone.js',
  './vendor/pdfjs/pdf.min.js', './vendor/pdfjs/pdf.worker.min.js',
  './pwa/manifest.json', './icon-192.png',
  /* 78TL (módulo isolado) */
  './tl/index.html',
  './tl/css/style-1.css',
  './tl/css/style-2.css',
  './tl/css/style-3.css',
  './tl/js/kob-bridge.js',
  './tl/js/script-1.js',
  './tl/js/script-10.js',
  './tl/js/script-11.js',
  './tl/js/script-12.js',
  './tl/js/script-13.js',
  './tl/js/script-14.js',
  './tl/js/script-15.js',
  './tl/js/script-16.js',
  './tl/js/script-17.js',
  './tl/js/script-18.js',
  './tl/js/script-19.js',
  './tl/js/script-2.js',
  './tl/js/script-20.js',
  './tl/js/script-21.js',
  './tl/js/script-22.js',
  './tl/js/script-23.js',
  './tl/js/script-24.js',
  './tl/js/script-25.js',
  './tl/js/script-26.js',
  './tl/js/script-27.js',
  './tl/js/script-28.js',
  './tl/js/script-29.js',
  './tl/js/script-3.js',
  './tl/js/script-30.js',
  './tl/js/script-31.js',
  './tl/js/script-32.js',
  './tl/js/script-33.js',
  './tl/js/script-34.js',
  './tl/js/script-35.js',
  './tl/js/script-36.js',
  './tl/js/script-37.js',
  './tl/js/script-38.js',
  './tl/js/script-39.js',
  './tl/js/script-4.js',
  './tl/js/script-40.js',
  './tl/js/script-41.js',
  './tl/js/script-42.js',
  './tl/js/script-43.js',
  './tl/js/script-5.js',
  './tl/js/script-6.js',
  './tl/js/script-7.js',
  './tl/js/script-8.js',
  './tl/js/script-9.js'
];
/* Dependências remotas do HTML: pré-carregadas na instalação quando o servidor permitir CORS */
const REMOTE = [
  'https://infodose.com.br/css/KodBllokX+.css',
  'https://infodose.com.br/css/KodBlloX+187.css',
  'https://infodose.com.br/css/kob-dox-nanai-v5.css',
  'https://infodose.com.br/css/symbolBar+1.css',
  'https://infodose.com.br/css/kob-glass-0.css',
  'https://www.infodose.com.br/js/modules/kob-fetchh.js',
  'https://infodose.com.br/oiDual/KODUX/78K/APPS/78PLAYER/Player-[di_jogador]-87-OK-000i0.js'
];
const HOSTS = ['infodose.com.br', 'www.infodose.com.br', 'kodux78k.github.io',
               'cdnjs.cloudflare.com', 'cdn.jsdelivr.net', 'fonts.googleapis.com', 'fonts.gstatic.com'];
const NEVER = [/oembed/i, /soundcloud/i];   /* conteúdo dinâmico: nunca cachear */

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await Promise.allSettled([
      ...LOCAL.map(u => c.add(new Request(u, { cache: 'reload' }))),
      ...REMOTE.map(u => c.add(new Request(u, { mode: 'cors', credentials: 'omit' })))
    ]);
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith('kob-') && k !== CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (e) => {
  const r = e.request;
  if (r.method !== 'GET' || r.headers.has('range')) return;
  const u = new URL(r.url);
  if (NEVER.some(rx => rx.test(r.url))) return;
  const same = u.origin === self.location.origin;
  if (!same && !HOSTS.includes(u.hostname)) return;

  if (r.mode === 'navigate') {            /* rede primeiro; offline → shell em cache */
    e.respondWith((async () => {
      try {
        const net = await fetch(r);
        if (net.ok) (await caches.open(CACHE)).put(r, net.clone());
        return net;
      } catch (_) {
        return (await caches.match(r, { ignoreSearch: true }))
            || (await caches.match('./index.html'))
            || (await caches.match('./'))
            || Response.error();
      }
    })());
    return;
  }

  e.respondWith((async () => {            /* stale-while-revalidate */
    const c = await caches.open(CACHE);
    const hit = await c.match(r, {});
    const upd = fetch(r).then(net => {
      if (net && (net.ok || net.type === 'opaque')) c.put(r, net.clone());
      return net;
    }).catch(() => null);
    if (hit) { e.waitUntil(upd); return hit; }
    return (await upd) || Response.error();
  })());
});
