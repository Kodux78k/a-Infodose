/* KOBLLUX · Service Worker · offline-first
   Local = fonte principal. CDN/infodose = cache em runtime (stale-while-revalidate).
   Suba VERSION a cada release para invalidar caches antigos. */
const VERSION = 'kob-v85-lazy-1';
const CACHE = VERSION;

/* Shell + vendor locais (cada item é tolerante a falha: arquivo ausente não quebra a instalação) */
const LOCAL = [
  './', './index-v85-lazy.html',
  './vendor/Tone.js',
  './vendor/pdfjs/pdf.min.js', './vendor/pdfjs/pdf.worker.min.js',
  './pwa/manifest.json', './icon-192.png'
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
               'cdnjs.cloudflare.com', 'fonts.googleapis.com', 'fonts.gstatic.com'];
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
            || (await caches.match('./index-v85-lazy.html'))
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
