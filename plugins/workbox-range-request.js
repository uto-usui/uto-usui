workbox.routing.registerRoute(
  /.*\.(mp4|webm)/,
  new workbox.strategies.CacheFirst({
    plugins: [
      new workbox.cacheableResponse.CacheableResponse({ statuses: [200] }),
      new workbox.rangeRequests.RangeRequestsPlugin(),
    ],
  }),
)
