const staticAkhilPortfolio = 'akhil-portfolio-site-v5';
const assets = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/favicon.ico',
  '/manifest.json',
  '/assets/app-icons/me-192.webp',
  '/assets/app-icons/me-256.webp',
  '/assets/app-icons/me-384.webp',
  '/assets/app-icons/me-512.webp',

  '/utils/css/background.css',
  '/utils/css/themeToggle.css',
  '/utils/css/typingEffect.css',
  '/utils/css/sendButton.css',
  '/utils/js/toggleTheme.js',
  '/utils/js/typingEffect.js',
  '/utils/js/detectTouchSwipes.js',
  '/utils/js/sendButton.js',
  '/utils/js/starField.js',
  '/utils/js/starFieldWorker.js',

  '/libraries/gsap.js',
  '/libraries/feather/feather.js',

  'https://ik.imagekit.io/at6kwvrzots/me-blurred_hF8NfM8nw.jpg',
  'https://ik.imagekit.io/at6kwvrzots/me_m8TQcP9Y8.webp',
];

self.addEventListener('install', (installEvent) => {
  installEvent.waitUntil(
    caches
      .open(staticAkhilPortfolio)
      .then((cache) => {
        const validAssets = assets.filter((asset) => {
          try {
            const url = new URL(asset, self.location.origin);
            return url.protocol === 'http:' || url.protocol === 'https:';
          } catch {
            return (
              !asset.includes('://') ||
              asset.startsWith('http://') ||
              asset.startsWith('https://')
            );
          }
        });
        return cache.addAll(validAssets);
      })
      .catch((error) => {
        console.error('Failed to cache assets:', error);
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (activateEvent) => {
  activateEvent.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== staticAkhilPortfolio) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (fetchEvent) => {
  try {
    const url = new URL(fetchEvent.request.url);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return;
    }
  } catch (error) {
    console.warn('Invalid URL in fetch event:', fetchEvent.request.url);
    return;
  }
  if (fetchEvent.request.destination === 'document') {
    fetchEvent.respondWith(
      fetch(fetchEvent.request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(staticAkhilPortfolio).then((cache) => {
              cache.put(fetchEvent.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(fetchEvent.request).then((cachedResponse) => {
            return cachedResponse || caches.match('/index.html');
          });
        })
    );
    return;
  }
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then((cachedResponse) => {
      if (cachedResponse) {
        const cacheDate = cachedResponse.headers.get('sw-cache-date');

        if (cacheDate) {
          const cachedDate = new Date(cacheDate);
          const now = new Date();
          const twoHours = 2 * 60 * 60 * 1000;

          if (now - cachedDate > twoHours) {
            return fetch(fetchEvent.request)
              .then((response) => {
                if (response && response.status === 200) {
                  const responseToCache = response.clone();

                  caches.open(staticAkhilPortfolio).then((cache) => {
                    const headers = new Headers(responseToCache.headers);
                    headers.set('sw-cache-date', now.toISOString());

                    responseToCache
                      .blob()
                      .then((blob) => {
                        const responseWithTimestamp = new Response(blob, {
                          status: responseToCache.status,
                          statusText: responseToCache.statusText,
                          headers: headers,
                        });
                        cache.put(fetchEvent.request, responseWithTimestamp);
                      })
                      .catch((error) => {
                        console.warn(
                          'Failed to create timestamped response:',
                          error
                        );
                        cache.put(fetchEvent.request, responseToCache);
                      });
                  });
                }
                return response;
              })
              .catch(() => cachedResponse);
          }

          return cachedResponse;
        } else {
          fetch(fetchEvent.request)
            .then((response) => {
              if (response && response.status === 200) {
                const responseToCache = response.clone();

                caches.open(staticAkhilPortfolio).then((cache) => {
                  const headers = new Headers(responseToCache.headers);
                  headers.set('sw-cache-date', new Date().toISOString());

                  responseToCache
                    .blob()
                    .then((blob) => {
                      const responseWithTimestamp = new Response(blob, {
                        status: responseToCache.status,
                        statusText: responseToCache.statusText,
                        headers: headers,
                      });
                      cache.put(fetchEvent.request, responseWithTimestamp);
                    })
                    .catch((error) => {
                      console.warn(
                        'Failed to create timestamped response:',
                        error
                      );
                      cache.put(fetchEvent.request, responseToCache);
                    });
                });
              }
            })
            .catch((error) => console.warn('Background fetch failed:', error));

          return cachedResponse;
        }
      }

      return fetch(fetchEvent.request)
        .then((response) => {
          if (
            !response ||
            response.status !== 200 ||
            response.type !== 'basic'
          ) {
            return response;
          }

          try {
            const requestUrl = new URL(fetchEvent.request.url);
            const isValidScheme =
              requestUrl.protocol === 'http:' ||
              requestUrl.protocol === 'https:';
            const isOwnOrigin = requestUrl.origin === self.location.origin;
            const isAllowedExternal = requestUrl.hostname === 'ik.imagekit.io';
            if (isValidScheme && (isOwnOrigin || isAllowedExternal)) {
              const responseToCache = response.clone();

              caches
                .open(staticAkhilPortfolio)
                .then((cache) => {
                  const headers = new Headers(responseToCache.headers);
                  headers.set('sw-cache-date', new Date().toISOString());

                  return responseToCache
                    .blob()
                    .then((blob) => {
                      const responseWithTimestamp = new Response(blob, {
                        status: responseToCache.status,
                        statusText: responseToCache.statusText,
                        headers: headers,
                      });
                      return cache.put(
                        fetchEvent.request,
                        responseWithTimestamp
                      );
                    })
                    .catch((error) => {
                      console.warn(
                        'Failed to create timestamped response:',
                        error
                      );
                      return cache.put(fetchEvent.request, responseToCache);
                    });
                })
                .catch((error) => {
                  console.warn(
                    'Failed to cache request:',
                    fetchEvent.request.url,
                    error
                  );
                });
            }
          } catch (error) {
            console.warn(
              'Error processing cache for:',
              fetchEvent.request.url,
              error
            );
          }

          return response;
        })
        .catch(() => {
          if (fetchEvent.request.destination === 'document') {
            return caches.match('/index.html');
          }
        });
    })
  );
});
