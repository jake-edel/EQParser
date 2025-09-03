/** @type {import('vite').UserConfig} */
import vue from '@vitejs/plugin-vue'
// TODO: load env from vite without needing dotenv
import 'dotenv/config'

process.env.BROWSER = 'chrome'

export default {
  root: './client',
  server: {
    port: 3000,
    proxy: {
      '/ws': {
        target: `ws://${process.env.HOST_IP}:4000`,
        ws: true,
        rewriteWsOrigin: true
      }
    }
  },
  plugins: [vue({
    isProduction: true,
    optionsAPI: false,
  })]

}