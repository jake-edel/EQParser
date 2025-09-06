/** @type {import('vite').UserConfig} */
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'fs'
import path from 'path'

process.env.BROWSER = 'chrome'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd() + '\\client', '')

  let https = {}
  if (mode === 'production') {
    https = {
      key: fs.readFileSync(path.resolve(__dirname, 'certs/localhost+1-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'certs/localhost+1.pem'))
    }
  }

  return {
    root: './client',
    server: {
      port: 3000,
      https,
      host: '0.0.0.0',
      proxy: {
        '/ws': {
          target: `ws://${env.VITE_HOST_IP}:4000`,
          ws: true,
          rewriteWsOrigin: true
        }
      }
    },
    preview: {
      host: true
    },
    plugins: [
      vue({
        isProduction: true,
        optionsAPI: false,
      })
    ]
  }
})