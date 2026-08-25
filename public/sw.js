// 宝贝学习乐园 - Service Worker
// 提供离线缓存和应用外壳能力

const CACHE_NAME = 'baby-learning-v1';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
];

// 安装：缓存应用外壳
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL).catch(() => {
        // 部分资源可能尚未构建，忽略错误
        return cache.add('./index.html');
      });
    })
  );
  self.skipWaiting();
});

// 激活：清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// 拦截请求：缓存优先策略
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // 只处理 GET 请求
  if (request.method !== 'GET') return;

  // 导航请求：网络优先，失败回退缓存
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request).then((r) => r || caches.match('./index.html')))
    );
    return;
  }

  // 静态资源：缓存优先，失败回退网络
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => {
          if (response && response.status === 200 && response.type === 'basic') {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => cached);
    })
  );
});

// 监听来自页面的消息
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
