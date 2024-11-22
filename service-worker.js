const CACHE_NAME = 'memo-app-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/manifest.json',
    '/icon.png' // Si vous avez une icône spécifique
];

// Lors de l'installation du service worker, on met en cache les fichiers nécessaires
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(urlsToCache);
            })
    );
});

// Lors de l'activation, on supprime les anciens caches pour ne garder que le cache actuel
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Intercepter les requêtes et servir les fichiers à partir du cache si disponible
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                // Si le fichier est dans le cache, on le retourne
                return cachedResponse;
            }
            // Sinon, on fait une requête réseau pour obtenir le fichier
            return fetch(event.request).then((networkResponse) => {
                // Si la réponse est valide, on la met en cache pour la prochaine fois
                if (networkResponse && networkResponse.status === 200) {
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, networkResponse.clone());
                    });
                }
                return networkResponse;
            });
        })
    );
});

