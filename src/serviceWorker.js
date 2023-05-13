const staticDevCoffee = 'dev-coffee-site-v1';
const assets = [
  '/',
  '/index.html',
  '/assets/icons/icon-192x192.png',
  '/assets/icons/icon-256x256.png',
  '/assets/icons/icon-384x384.png',
  '/assets/icons/icon-512x512.png',
  '/assets/me-blurred.jpg',
  '/assets/svgData',
  'https://ik.imagekit.io/at6kwvrzots/me_m9r7G3zJK.jpg',
  '/utils/background.min.css',
  '/utils/themeToggle.min.css',
  '/utils/typingEffect.min.css',
  '/style.min.css',
  '/utils/sendButton.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.4.2/gsap.min.js',
  'https://code.jquery.com/jquery-3.5.1.min.js',
  'https://kit.fontawesome.com/7deebd1f3c.js',
  'https://cdn.jsdelivr.net/npm/animejs@3.2.0/lib/anime.min.js',
  'https://cdn.jsdelivr.net/npm/feather-icons/dist/feather.min.js',
  '/script.min.js',
  '/utils/toggleTheme.min.js',
  '/utils/typingEffect.min.js',
  '/utils/detectTouchSwipes.min.js',
  '/utils/sendButton.min.js',
];

self.addEventListener('install', (installEvent) => {
  installEvent.waitUntil(
    caches.open(staticDevCoffee).then((cache) => {
      cache.addAll(assets);
    })
  );
});

self.addEventListener('fetch', (fetchEvent) => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then((res) => {
      return res || fetch(fetchEvent.request);
    })
  );
});
