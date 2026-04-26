import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = (env.VITE_SITE_URL ?? '').trim().replace(/\/$/, '')
  const ogImage = siteUrl ? `${siteUrl}/metadata/og.png` : '/metadata/og.png'
  const canonicalLink = siteUrl
    ? `<link rel="canonical" href="${siteUrl}/" />\n    <meta property="og:url" content="${siteUrl}/" />`
    : ''

  return {
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'inject-site-meta',
      transformIndexHtml(html) {
        return html
          .replaceAll('__OG_IMAGE__', ogImage)
          .replace('<!--vite-canonical-->', canonicalLink)
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
