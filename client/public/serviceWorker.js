self.addEventListener('install', event => {
  console.log('Service worker: Install event')
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  console.log('Service worker activated')
})

self.addEventListener('fetch', event => {
  console.log('Fetch event', event)
})