const CACHE_NAME = "menu-app-cache-v1";
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    // Ajoutez ici d'autres fichiers nécessaires au bon fonctionnement de l'application
];

// Installation du service worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log("Service Worker: Caching files");
                return cache.addAll(urlsToCache);
            })
    );
});

// Activation du service worker
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        // Supprimer les anciennes caches
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Intercepter les requêtes réseau et répondre à partir du cache si disponible
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                // Si la ressource est dans le cache, la retourner
                if (cachedResponse) {
                    return cachedResponse;
                }
                // Sinon, faire une requête réseau
                return fetch(event.request);
            })
    );
});
