importScripts('public/js/idb.js');
importScripts('public/js/util.js');

let CACHE_STATIC_NAME = 'static-v22';
let CACHE_DYNAMIC_NAME = 'dynamic-v14';
let STATIC_FILES = [
    '/',
    '/index.html',
    '/offline.html',
    'public/js/fetch.js',
    'public/js/promise.js',
    'public/js/idb.js',
    'public/js/util.js',
    'public/js/main.js',
    'public/js/app.js',
    'https://www.w3schools.com/w3css/4/w3.css'
]


// installing service worker
self.addEventListener('install', (event) => {
    console.log('[Service worker] Installing service install', event);
    event.waitUntil(
        caches.open(CACHE_STATIC_NAME)
            .then((cache) => {
                console.log('[Service worker] Precacheing Add file');
                cache.addAll(STATIC_FILES);
            })
    )
})

//Activating service worker
self.addEventListener('activate', (event) => {
    console.log('[Service worker] Activating service install', event);
    event.waitUntil(
        caches.keys()
            .then((keyList) => {
                return Promise.all(keyList.map((key) => {
                    if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
                        return caches.delete(key)
                    }
                }));
            })
    )
    return self.clients.claim();
})

//fetching data from cache and network

self.addEventListener('fetch', (event) => {
    let url = 'https://free.currencyconverterapi.com/api/v5/currencies';
    if (event.request.url.indexOf(url) > -1) {
        event.respondWith(
            fetch(event.request)
                .then((res) => {
                    console.log(res);
                    let clonedRes = res.clone();
                    clearData('curr')
                        .then(() => {
                            return clonedRes.json();
                        })
                        .then((data) => {
                            console.log(data);
                            Object.values(data.results).forEach(element => {
                                const { currencyName, id } = element;
                                storeData('curr', element);
                            });
                        });
                    return res;
                })
        );
    } else {
        event.respondWith(
            caches.match(event.request)
                .then((res) => {
                    if (res) {
                        return res;
                    } else {
                        return fetch(event.request)
                            .then((res) => {
                                return caches.open(CACHE_DYNAMIC_NAME)
                                    .then((cache) => {
                                        cache.put(event.request.url, res.clone());
                                        return res;
                                    })
                            })
                            .catch((err) => {
                                return caches.open(CACHE_STATIC_NAME)
                                    .then((cache) => {
                                        if (event.request.headers.get('accept').includes('text/html')) {
                                            return cache.match('/offline.html');
                                        }
                                    });
                            });
                    }
                })
        );
    }
});