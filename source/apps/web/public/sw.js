/* Mzizi service worker: keeps the app shell available offline. Pages load from the network first; if the network is
   down, a cached copy of a page you already opened, or the offline page, is shown. */
const SHELL = "mzizi-shell";
const PAGES = "mzizi-pages";
const STATIC = "mzizi-static";
const PRECACHE = ["/offline.html", "/icons/icon-192.png", "/icons/icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(SHELL).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => ![SHELL, PAGES, STATIC].includes(k)).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return; // never touch other sites

  // Pages: network first, then a copy you opened before, then the offline page.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).then((res) => { const copy = res.clone(); caches.open(PAGES).then((c) => c.put(req, copy)); return res; })
        .catch(async () => (await caches.match(req)) || (await caches.match("/offline.html")))
    );
    return;
  }
  // Built assets and icons never change under the same name: cache first.
  if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/icons/") || url.pathname.startsWith("/sources/")) {
    event.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => { const copy = res.clone(); caches.open(STATIC).then((c) => c.put(req, copy)); return res; })));
  }
});
