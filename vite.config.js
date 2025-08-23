/** @type {import('vite').UserConfig} */

process.env.BROWSER = 'chrome'
const ipHost = {
  'DESKTOP-888IED3': '192.168.1.79'
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