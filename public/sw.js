// 旧サイト（Nuxt PWA / Workbox）の Service Worker を解除するためのファイル。
// 更新確認が 404 になったときの扱いはブラウザで異なるので、旧 SW が残る場合に備えてこのパスで配信し続ける。
// fetch のハンドラーは置かない（置かなければリクエストはそのままネットワークに行く）
self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(keys.map((key) => caches.delete(key)))
      await self.registration.unregister()
      const clients = await self.clients.matchAll({ type: 'window' })
      await Promise.all(clients.map((client) => client.navigate(client.url)))
    })(),
  )
})
