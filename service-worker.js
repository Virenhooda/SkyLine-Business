self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('skyline-cache').then((cache) =>
      cache.addAll(['/', '/index.html', '/styles.css', '/main.js', '/firebaseConfig.js', '/auth.js', '/db.js'])
    )
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then((response) => response || fetch(e.request)));
});