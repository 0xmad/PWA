/* global caches */
/* global self */
'use strict';

const CACHE_VERSION = 2;
const CURRENT_CACHES = {
  prefetch: 'prefetch-cache-v' + CACHE_VERSION
};

self.addEventListener('install', (event) => {
  const urlsToPrefetch = [
    './',
    './index.html',
    // The videos are stored remotely with CORS enabled.
    'https://scontent.cdninstagram.com/t50.2886-16/15219754_184048185390174_375691810267201536_n.mp4',
  ];

  self.skipWaiting();

  event.waitUntil(
    caches.open(CURRENT_CACHES.prefetch).then((cache) => {
      return cache.addAll(urlsToPrefetch);
    })
  );
});

self.addEventListener('activate', function (event) {
  const expectedCacheNames = Object.keys(CURRENT_CACHES).map((key) => {
    return CURRENT_CACHES[key];
  });

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (expectedCacheNames.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.headers.get('range')) {
    const pos = Number(/^bytes=(\d+)-$/g.exec(event.request.headers.get('range'))[1]);
    event.respondWith(
      caches.open(CURRENT_CACHES.prefetch)
        .then((cache) => cache.match(event.request.url))
        .then((res) => {
          if (!res) {
            return fetch(event.request)
              .then(res => res.arrayBuffer());
          }
          return res.arrayBuffer();
        })
        .then((ab) => {
          return new Response(
            ab.slice(pos),
            {
              status: 206,
              statusText: 'Partial Content',
              headers: [
                ['Content-Type', 'video/webm'],
                ['Content-Range', 'bytes ' + pos + '-' +
                (ab.byteLength - 1) + '/' + ab.byteLength]]
            });
        }));
  } else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request).then((response) => response)
          .catch((error) => {
            throw error;
          });
      })
    );
  }
});
