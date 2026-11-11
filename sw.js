// sw.js — Service Worker básico para que la app funcione instalada y offline

const CACHE_NAME = "gestor-notas-cache-v1";
const ARCHIVOS_A_GUARDAR = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./app.js",
    "./manifest.json",
    "./icons/icon-192.png",
    "./icons/icon-512.png"
];

// Al instalar: guardamos los archivos base en caché
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ARCHIVOS_A_GUARDAR))
    );
    self.skipWaiting();
});

// Al activar: borramos cachés viejos de versiones anteriores
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((nombres) =>
            Promise.all(
                nombres
                    .filter((nombre) => nombre !== CACHE_NAME)
                    .map((nombre) => caches.delete(nombre))
            )
        )
    );
    self.clients.claim();
});

// Al pedir un archivo: primero intenta la red, si falla usa la caché
// (así el usuario siempre ve la versión más nueva si tiene internet)
self.addEventListener("fetch", (event) => {
    // No interceptamos llamadas a Firebase/Firestore, solo archivos propios
    if (event.request.url.includes("firestore.googleapis.com") ||
        event.request.url.includes("googleapis.com") ||
        event.request.url.includes("gstatic.com")) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((respuesta) => {
                const copia = respuesta.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copia));
                return respuesta;
            })
            .catch(() => caches.match(event.request))
    );
});