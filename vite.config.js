/** @type {import('vite').UserConfig} */

process.env.BROWSER = 'chrome'
const ipHost = {
  'DESKTOP-888IED3': '192.168.1.79', // Laptop
  'DESKTOP-C1K7U0D': '172.21.144.1' // Desktop
}

export default {
  root: './public',
  base: '/dashboard',
  server: {
    port: 3000,
    open: '/dashboard',
    watch: './public',
    proxy: {
      '/ws': {
        target: `ws://${ipHost[process.env.COMPUTERNAME]}:4000`,
        ws: true,
        rewriteWsOrigin: true
      }
    }
  }
}