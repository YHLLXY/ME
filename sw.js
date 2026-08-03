/* v3：旧缓存含损坏的 render.js（S1 未闭合），必须换新缓存桶 + 同步移除已删除的 anime */
const CACHE = 'self-portrait-v3';
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
  SCOPE + '/js/ui.js'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(res => {
        /* 只缓存成功响应（404 不入缓存），waitUntil 保活确保写入完成 */
        if (res.ok) {
          const clone = res.clone();
          e.waitUntil(caches.open(CACHE).then(c => c.put(e.request, clone)));
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    Promise.all([
      /* 立即接管所有同域标签页，避免刷新一次才生效 */
      clients.claim(),
      caches.keys().then(keys =>
        Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
      )
    ])
  );
});