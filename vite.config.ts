import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** Short fingerprint so favicon URL changes when the file changes (browsers cache icons aggressively). */
function publicAssetRev(relativeToRoot: string): string | null {
  const full = join(__dirname, relativeToRoot)
  if (!existsSync(full)) return null
  return createHash('sha256').update(readFileSync(full)).digest('hex').slice(0, 10)
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = (env.VITE_SITE_URL ?? '').trim().replace(/\/$/, '')
  const ogRev = publicAssetRev('public/metadata/og.png')
  const ogPath = ogRev ? `/metadata/og.png?v=${ogRev}` : '/metadata/og.png'
  const ogImage = siteUrl ? `${siteUrl}${ogPath}` : ogPath
  const canonicalLink = siteUrl
    ? `<link rel="canonical" href="${siteUrl}/" />\n    <meta property="og:url" content="${siteUrl}/" />`
    : ''

  const faviconRev = publicAssetRev('public/metadata/favicon-24.png')
  const webclipRev = publicAssetRev('public/metadata/webclip-256.png')
  /** When set, `npm run dev` proxies `/api/*` here (e.g. `http://127.0.0.1:3000` from `vercel dev`). */
  const localApiProxy = (env.VITE_LOCAL_API_PROXY ?? '').trim().replace(/\/$/, '')

  return {
  ...(localApiProxy
    ? {
        server: {
          proxy: {
            '/api': { target: localApiProxy, changeOrigin: true },
          },
        },
      }
    : {}),
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'inject-site-meta',
      transformIndexHtml(html) {
        let out = html
          .replaceAll('__OG_IMAGE__', ogImage)
          .replace('<!--vite-canonical-->', canonicalLink)
        if (faviconRev) {
          out = out.replace(
            'href="/metadata/favicon-24.png"',
            `href="/metadata/favicon-24.png?v=${faviconRev}"`,
          )
        }
        if (webclipRev) {
          out = out.replace(
            'href="/metadata/webclip-256.png"',
            `href="/metadata/webclip-256.png?v=${webclipRev}"`,
          )
        }
        return out
      },
    },
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/framer-motion')) return 'motion'
          if (id.includes('node_modules/react-router')) return 'router'
        },
      },
    },
  },
  }
})
