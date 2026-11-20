/* Retire the former root-scoped prototype worker. The permanent demo registers /demo/sw.js. */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.registration.unregister()));
