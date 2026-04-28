import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CHUNK_LOAD_RECOVERY_SESSION_KEY } from './lib/chunkLoadRecovery'
import './index.css'
import App from './App.tsx'

// Stale hashed chunks after deployment can make preloads fail — one reload pulls the new shell/manifest (Vite).
window.addEventListener('vite:preloadError', () => {
  try {
    if (!sessionStorage.getItem(CHUNK_LOAD_RECOVERY_SESSION_KEY)) {
      sessionStorage.setItem(CHUNK_LOAD_RECOVERY_SESSION_KEY, '1')
      window.location.reload()
    }
  } catch {
    window.location.reload()
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
