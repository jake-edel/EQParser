/** @type {import('vite').UserConfig} */
import vue from '@vitejs/plugin-vue'
import 'dotenv/config'

process.env.BROWSER = 'chrome'

export default {

  root: './client',
  server: {
    port: 3000,
    open: '/dashboard',
    watch: './client',
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