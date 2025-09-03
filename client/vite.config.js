/** @type {import('vite').UserConfig} */
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

process.env.BROWSER = 'chrome'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd() + '\\client', '')

  return {
    root: './client',
    server: {
      port: 3000,
      proxy: {
        '/ws': {
          target: `ws://${env.VITE_HOST_IP}:4000`,
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
})