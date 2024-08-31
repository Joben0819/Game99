const CACHE_NAME = 'app-cache';
const urlsToCache = [
    // Add other assets you want to cache initially
    '/offline.html',
    '/invite',
    '/'
];

// Install the service worker and cache initial assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(urlsToCache);
            })
    );
});

// Intercept network requests and serve cached assets
self.addEventListener('fetch', (event) => {
    const requestUrl = new URL(event.request.url);

    // Skip caching for unsupported schemes
    if (!['http:', 'https:'].includes(requestUrl.protocol)) {
        return;
    }

    // Handle JS files and images
    if (requestUrl.pathname.endsWith('.js') || requestUrl.pathname.endsWith('.css') || requestUrl.pathname.endsWith('.html')|| requestUrl.pathname.match(/\.(png|jpg|jpeg|svg|gif|webp|ico|ttf|woff|woff2|eot|otf|svga|next)$/)) {
        event.respondWith(
            caches.match(event.request)
                .then((response) => {
                    // Return cached asset if available
                    if (response) {
                        return response;
                    }

                    // If not cached, fetch from network and cache it
                    return fetch(event.request).then((networkResponse) => {
                        // Check if the response is valid before caching
                        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                            return networkResponse;
                        }

                        return caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, networkResponse.clone());
                            return networkResponse;
                        });
                    });
                })
        );
    }
});

// Clean up old caches
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
