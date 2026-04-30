// Minimal service worker — no caching, no interception.
// Exists so browsers that already registered it get a clean update.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());
