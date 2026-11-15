const CACHE_NAME = 'praca-viva-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/app.js',
  '/manifest.json',
  '/plantas/css/style-plantas.css',
  '/plantas/js/track.js',
  '/plantas/01_boldo.html',
  '/plantas/02_hortela.html',
  '/plantas/03_erva-cidreira.html',
  '/plantas/04_capim-santo.html',
  '/plantas/05_babosa.html',
  '/plantas/06_alecrim.html',
  '/plantas/07_mastruz.html',
  '/plantas/08_alfavaca.html',
  '/plantas/09_acerola.html',
  '/plantas/10_goiaba.html',
  '/plantas/11_pitanga.html',
  '/plantas/12_jabuticaba.html',
  '/plantas/13_limao.html',
  '/plantas/14_laranja.html',
  '/plantas/15_banana.html',
  '/plantas/16_mamao.html',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Instalação do Service Worker e Caching dos arquivos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto com sucesso');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
  self.skipWaiting();
});

// Ativação e limpeza de caches antigos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Apagando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Interceptação de requisições (Modo Offline)
self.addEventListener('fetch', event => {
  // Ignora requisições POST (como a chamada da nossa API de métricas)
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retorna o arquivo em cache se existir (Modo Offline)
        if (response) {
            return response;
        }
        // Se não estiver no cache, tenta buscar na rede
        return fetch(event.request).then(networkResponse => {
            // Verifica se a resposta é válida
            if(!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            
            // Faz um clone da resposta e salva no cache para a próxima vez
            let responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
        });
      })
  );
});
