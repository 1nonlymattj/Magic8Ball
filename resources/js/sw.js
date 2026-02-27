const CACHE_NAME = "magic8ball-static-v1";
const ASSETS = [
  "/",
  "/index.html",
  "/resources/css/Magic8Ball.css",
  "/resources/js/app.js.js",
  "/resources/js/answers.js",
  "/resources/js/variables.js",
  "/resources/js/storage.js",
  "/resources/js/sw-register.js",
  "/resources/img/8ball1.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});