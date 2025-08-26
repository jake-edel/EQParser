/** @type {import('vite').UserConfig} */

process.env.BROWSER = 'chrome'
const ipHost = {
  'DESKTOP-888IED3': '192.168.1.79', // Laptop
  'DESKTOP-C1K7U0D': '172.21.144.1' // Desktop
}

export default {
  root: './client',
  server: {
    port: 3000,
    open: '/dashboard',
    watch: './client',
    proxy: {
      '/ws': {
        target: `ws://${ipHost[process.env.COMPUTERNAME]}:4000`,
        ws: true,
        rewriteWsOrigin: true
      }
    }
  }
}