const CACHE = 'self-portrait-v2';
const SCOPE = self.location.pathname.replace(/\/[^/]*$/, '');
const ASSETS = [
  SCOPE + '/',
  SCOPE + '/index.html',
  SCOPE + '/css/style.css',
  SCOPE + '/js/app.js',
  SCOPE + '/js/store.js',
  SCOPE + '/js/questions.js',
  SCOPE + '/js/render.js',
  SCOPE + '/js/scoring.js',
  SCOPE + '/js/report.js',
  SCOPE + '/js/ui.js',
  SCOPE + '/js/lib/anime.umd.min.js'
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