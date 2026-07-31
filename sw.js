const CACHE = 'self-portrait-v1';
const ASSETS = [
  '/', '/index.html', '/css/style.css',
  '/js/app.js', '/js/store.js', '/js/questions.js',
  '/js/render.js', '/js/scoring.js', '/js/report.js', '/js/ui.js',
  '/js/lib/anime.umd.min.js'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
});